package inventory

import (
	"bufio"
	log "github.com/sirupsen/logrus"
	"io"
	"os"
	"sync"
	"time"
)

type ContinuousReader interface {
	io.Closer

	Start()
	RecordChan() <-chan string
}

type continuousFileReader struct {
	path        string
	recordChan  chan string
	controlChan chan bool
	waitGroup   *sync.WaitGroup
}

func NewContinuousFileReader(path string) ContinuousReader {
	r := &continuousFileReader{
		path:        path,
		recordChan:  make(chan string),
		controlChan: make(chan bool),
		waitGroup:   &sync.WaitGroup{},
	}
	return r
}

func (r *continuousFileReader) Start() {
	log.Debug("starting file reader...")

	// Artifical delay. Pretend it takes a while to connect to the source.
	time.Sleep(5 * time.Second)

	// Read from the file.
	go func() {
		r.waitGroup.Add(1)
		r.tail(r.path)
		r.waitGroup.Done()
	}()

	log.Debug("started")

	r.waitGroup.Wait()
}

func (r *continuousFileReader) RecordChan() <-chan string {
	return r.recordChan
}

func (r *continuousFileReader) Close() error {
	// First, signal that we are stopping. This stops putting new records on
	// to recordChan.
	r.controlChan <- true
	// Stopping the controlChan will eventually stop the continuous file read.
	r.waitGroup.Wait()
	// We can close the recordChan now that we know nothing will write to it.
	close(r.recordChan)

	return nil
}

func (r *continuousFileReader) String() string {
	return "fileReader"
}

// https://stackoverflow.com/a/49050628/1459103
// Could use fsnotify for a better experience, but maybe less portable.
func (r *continuousFileReader) tail(filename string) {
	file, err := os.Open(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()
	reader := bufio.NewReader(file)
	info, err := file.Stat()
	if err != nil {
		panic(err)
	}
	oldSize := info.Size()
	for {
		for line, prefix, err := reader.ReadLine(); err != io.EOF; line, prefix, err = reader.ReadLine() {
			if prefix {
				r.recordChan <- string(line)
			} else {
				r.recordChan <- string(line) + "\n"
			}
		}
		pos, err := file.Seek(0, io.SeekCurrent)
		if err != nil {
			panic(err)
		}
	ForLoop:
		for {
			select {
			case _, _ = <-r.controlChan:
				log.Debug("stopping file reader...")
				// Artificial delay. Pretend it takes a sec to close down.
				time.Sleep(time.Second * 4)
				log.Debug("stopped")
				return
			default:
				time.Sleep(time.Millisecond * 50)
				newinfo, err := file.Stat()
				if err != nil {
					panic(err)
				}

				newSize := newinfo.Size()
				if newSize == oldSize {
					continue
				}

				if newSize < oldSize {
					file.Seek(0, 0)
				} else {
					file.Seek(pos, io.SeekStart)
				}
				// If you want to see what would happen in the case of a race
				// condition where we get a SIGINT while we're in the middle
				// or reading a line, uncomment this and add some logging.
				// syscall.Kill(syscall.Getpid(), syscall.SIGINT)
				reader = bufio.NewReader(file)
				oldSize = newSize
				break ForLoop
			}
		}
	}
}
