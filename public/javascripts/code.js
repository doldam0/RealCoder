var editor;

$(() => {
    $('.ui.dropdown')
        .dropdown({
            onChange: (value, text, $selectedItem) => {
                editor.setOption('mode', value);
                console.log(editor.getOption('mode'));
            }
		})
	;

    editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        mode				: "",
		styleActiveLine 	: true,
		indentUnit			: 4,
		indentWithTabs		: true,
        lineNumbers     	: true,
		lineWrapping    	: true,
		matchBrackets		: true,
		autoCloseBrackets	: true,
        extraKeys: {
            "Alt-Space": "autocomplete",
            "Alt-Q": function(appCM) {
                appCM.foldCode(appCM.getCursor());
            }
        }
	});
	editor.getDoc().setValue("");

	console.log(editor);
	
	setInterval(() => {
		if ($('#editor').hasClass('inverted')) {
			editor.setOption('theme', 'panda-syntax');
			console.log(editor.getOption('theme'));
		} else {
			editor.setOption('theme', 'eclipse');
			console.log(editor.getOption('theme'));
		}
	}, 100);
});