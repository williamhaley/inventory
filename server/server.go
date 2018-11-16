package inventory

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"net/http"
	"time"
)

func newRouter(onClose func()) *http.ServeMux {
	sm := http.NewServeMux()
	sm.HandleFunc("/favicon.ico", func(rw http.ResponseWriter, r *http.Request) {
		rw.Write([]byte("favicon aaaaah!"))
	})
	sm.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		rw.Write([]byte("404!"))
	})
	sm.HandleFunc("/shutdown", func(rw http.ResponseWriter, r *http.Request) {
		rw.Write([]byte("shutting down!"))
		onClose()
	})
	return sm
}

func Serve(port int) {
	var server *http.Server
	router := newRouter(func() {
		server.Close()
	})
	server = &http.Server{
		Addr:         fmt.Sprintf(":%d", port),
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	log.Debug("serving at " + server.Addr)
	// This blocks until the server is finished. err is always non-nil
	err := server.ListenAndServe()
	if err != http.ErrServerClosed {
		log.WithError(err).Error("error shutting down server")
	}
	log.Debugf("done serving from %d", port)
}
