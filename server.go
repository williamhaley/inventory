package inventory

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"io"
	"net/http"
	"time"
)

type Server interface {
	http.Handler
	io.Closer
	Start()
}

type httpServer struct {
	server *http.Server
}

func NewServer(port int) Server {
	router := newRouter()
	// Can/should this be embedded into the httpServer struct?
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", port),
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	return &httpServer{
		server,
	}
}

func newRouter() *http.ServeMux {
	sm := http.NewServeMux()
	sm.HandleFunc("/favicon.ico", func(rw http.ResponseWriter, r *http.Request) {
		rw.Write([]byte("favicon aaaaah!"))
	})
	sm.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		rw.Write([]byte("404!"))
	})
	sm.HandleFunc("/stop", func(rw http.ResponseWriter, r *http.Request) {
		rw.Write([]byte("stopping!"))
	})
	sm.HandleFunc("/shutdown", func(rw http.ResponseWriter, r *http.Request) {
		rw.Write([]byte("shutting down!"))
	})
	return sm
}

func (server *httpServer) Start() {
	log.Debugf("started serving from %v", server.server.Addr)
	// This blocks until the server is finished. err is always non-nil
	err := server.server.ListenAndServe()
	if err != http.ErrServerClosed {
		log.WithError(err).Error("error shutting down server")
	}
	log.Debugf("done serving from %v", server.server.Addr)

}

func (server *httpServer) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	log.Debugf("%s %s", r.Method, r.URL)
	fmt.Println("wut")
	server.server.Handler.ServeHTTP(rw, r)
}

func (server *httpServer) Close() error {
	return server.server.Close()
}

func (server *httpServer) String() string {
	return "httpServer"
}
