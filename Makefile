all: babel messages 

babel:
	babel --modules ignore --source-maps --out-file src/js/gettext-compiled.js src/js/gettext.js

messages:
	msgfmt -o demo/locale/en/LC_MESSAGES/messages.mo demo/locale/en/LC_MESSAGES/messages.po
	msgfmt -o demo/locale/ja/LC_MESSAGES/messages.mo demo/locale/ja/LC_MESSAGES/messages.po
	gettextjs -iv demo/locale
	gettextjs -iv --js demo/locale

