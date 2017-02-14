/**
 * Created by Peyton on 2/13/2017.
 */

var curDirectory = "\\";
var commands = [];
var commandIndex = 0;

var curInput = " ";
var curIndex = 0;

$(function() {
    $("#submit").focus();
});

$(function() {
    $("#submit").on("focusout", function() {
        $("#submit").focus();
    });
});

function printResponse(data) {
    if (data.type == "error") {
        $('#responses').append('<li>' + data.message + '</li>');
    } else if (data.type == "cd") {
        curDirectory = data.directory;
        $('#dir').html(curDirectory + ">");
    } else if (data.type == "stream") {
        console.log(data.message.size);
        for (i = 0; i < data.message.length; i++) {
            $('#responses').append('<li>' + "&nbsp;" + "&nbsp;" + data.message[i] + '</li>');
        }
    }
}

$(function(){
    $('#submit').on('keyup', function(e){
        if(e.keyCode === 13) {
            var parameters = { curDirectory : curDirectory , submit: $(this).val() };
            $('#responses').append('<li>' + curDirectory + ">" +  $(this).val() + '</li>');
            commands.push($(this).val());
            commandIndex++;
            commands.slice(0, commandIndex);
            $('#submit').val("");
            $.post( '/logging', parameters, function(data) {
                printResponse(data);
            });
        } else if (e.keyCode === 38) {
            if (commandIndex != 0) {
                commandIndex--;
                $('#submit').val(commands[commandIndex]);
            }
        } else if (e.keyCode === 40) {
            if (commandIndex < commands.length - 1) {
                commandIndex++;
                $('#submit').val(commands[commandIndex]);
            } else {
                commandIndex = commands.length;
                $('#submit').val("");
            }
        };
    });
});