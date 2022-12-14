devserver:
	npm run server:watch

devclient:
	cd client && npm run dev




install:
	npm install -g typescript
	npm install -g ts-node
	npm install
	npm install -g ./

macdeps:
	brew install ffmpeg
	brew install yt-dlp
	pip install git+https://github.com/openai/whisper.git 

upgrademacdeps:	
	brew upgrade
	pip install --upgrade --no-deps --force-reinstall git+https://github.com/openai/whisper.git
