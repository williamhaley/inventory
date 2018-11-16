package main

import (
	log "github.com/sirupsen/logrus"
	"github.com/williamhaley/inventory"
	"io"
	"os"
	"os/signal"
	"sync"
)

type InventoryApp struct {
	server inventory.Server
	reader inventory.ContinuousReader
}

func main() {
	log.SetLevel(log.DebugLevel)
	inventoryApp := NewInventoryApp()
	inventoryApp.Start()
}

func (a *InventoryApp) Close() error {
	var err error

	// server and reader conform to the Close() interface.
	for _, closer := range []io.Closer{a.server, a.reader} {
		err = closer.Close()
		if err != nil {
			log.Errorf("error closing %v", closer)
			break
		}
		log.Debugf("%v closed", closer)
	}

	if err != nil {
		log.Debug(err)
		return err
	}

	log.Debug("closing inventory app")
	return nil
}

func (a *InventoryApp) Start() {
	wg := &sync.WaitGroup{}

	wg.Add(1)
	go func() {
		// Could potentially pass the wg to the server and have it call Done()
		// but I prefer seeing the Add() and Done() together here.
		a.server.Start()
		wg.Done()
	}()

	wg.Add(1)
	go func() {
		a.reader.Start()
		wg.Done()
	}()

	wg.Wait()

	log.Debug("goodbye")
}

func NewInventoryApp() *InventoryApp {
	inventoryApp := &InventoryApp{
		server: inventory.NewServer(8080),
		reader: inventory.NewContinuousFileReader("/tmp/file.log"),
	}

	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, os.Interrupt)
	go func() {
		signal := <-signalChan
		log.Debug("signal:", signal)
		err := inventoryApp.Close()
		if err != nil {
			os.Exit(1)
		}
		os.Exit(0)
	}()

	go func(reader inventory.ContinuousReader) {
	ForLoop:
		for {
			select {
			case record, isOpen := <-reader.RecordChan():
				if !isOpen {
					break ForLoop
				}
				log.Debugf("record! %s", record)
			}
		}
	}(inventoryApp.reader)

	return inventoryApp
}
