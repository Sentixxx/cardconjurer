start:
	docker build -f Dockerfile --target "prod" . -t "cardconjurer-client" && docker run -dit -h 127.0.0.1 -p 4242:4242 "cardconjurer-client"
test:
	docker run -dit -p 4242:4242 -v $(PWD):/usr/share/nginx/html "cardconjurer-client"
