package main

import (
	log "github.com/sirupsen/logrus"
	"github.com/williamhaley/inventory/server"
	"sync"
)

func main() {
	log.SetLevel(log.DebugLevel)

	wg := &sync.WaitGroup{}

	for i := 0; i < 4; i++ {
		wg.Add(1)
		go func(port int) {
			// Could pass the wg as an arg to serve and have it invoke Done()
			// but seems a little cleaner if serve() needn't know/care about it.
			defer wg.Done()
			inventory.Serve(port)
		}(8080 + i)
	}

	wg.Wait()
	log.Debug("goodbye")
}
