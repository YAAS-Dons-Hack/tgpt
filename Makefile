TS_PROG = tgpt.ts
JS_PROG = tgpt.js
JS_DIR = dist

compile:
	npx tsc

run:
	node $(JS_DIR)/$(JS_PROG) $(ARG)

clean:
	rm -rf $(JS_DIR)

install:
	bash install.sh

default:
	compile
