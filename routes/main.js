/**
 * Created by Peyton on 2/13/2017.
 */

var express = require('express');
var router = express.Router();

var directory = {"\\" : {
    "contents" : {
        "test1" : {
            "name" : "test1",
            "type" : "directory",
            "hidden" : false
        },
        "test2.txt" : {
            "name" : "test2.txt",
            "type" : "text" ,
            "contents" : ["the truth"] ,
            "hidden" : false
        } ,
        "test3.txt" : {
            "name" : "test3.txt",
            "type" : "text" ,
            "contents" : ["even truthier"] ,
            "hidden" : true
        }
    },
    "parent" : null
}, "\\test1\\" : {
    "contents" : {
        "test4.txt" : {
            "name" : "test4.txt",
            "type" : "text" ,
            "contents" : ["little more truthy"]
        }
    } ,
    "parent" : "\\"
}};

function main(curDirectory, command) {
    command = command.split(" ");
    if (command[0] == "ls") {
        return ls(curDirectory);
    } else if (command[0] == "cd") {
        return cd(curDirectory, command[1]);
    } else if (command[0] == "help") {
        return help();
    } else if (command[0] == "man") {
        return man(command[1]);
    } else if (command[0] == "cat") {
        return cat(curDirectory, command[1]);
    } else {
        return {"type" : "error", "message" : "Invalid command, or you do not have access.  Please contact an administrator."};
    }
}

function cd(curDirectory, arg) {
    if (arg.charAt(0) == '\\') {
        console.log(curDirectory);
        curDirectory = "\\";
    }
    var parts = arg.split("\\");
    var part;
    for (i = 0; i < parts.length; i++) {
        part = parts[i];
        if (part == "..") {
            if (directory[curDirectory].parent != null) {
                curDirectory = directory[curDirectory].parent;
            } else {
                return {"type" : "error", "message" : "Bad directory, or you do not have access.  Please contact an administrator."};
            }
        } else {
            var next = directory[curDirectory].contents[part];
            if (next == null || next["type"] != "directory") {
                return {"type" : "error", "message" : "Bad directory, or you do not have access.  Please contact an administrator."};
            } else {
                curDirectory = curDirectory + part + "\\"
            }
        }
    }
    return {"type" : "cd", "directory" : curDirectory};
}

function ls(curDirectory) {
    var folders = [];
    var files = [];
    var contents = directory[curDirectory].contents;
    for (var item in contents) {
        if (!contents[item].hidden) {
            if (contents[item].type == "directory") {
                folders.push("&nbsp;" + "&nbsp;" + item);
            } else {
                files.push("&nbsp;" + "&nbsp;" + item);
            }
        }
    }
    var allContents = [];
    allContents.push("Directories:");
    allContents = allContents.concat(folders);
    allContents.push("Other files:");
    allContents = allContents.concat(files);
    return {"type" : "stream" , "message" : allContents};
}

function help() {

}

function man(arg) {

}

function cat(curDirectory, arg) {
    contents = directory[curDirectory].contents[arg];
    console.log(contents);
    if (contents == null || contents.type == "directory") {
        return { "type" : "error" , "message" : "Bad file, or you do not have access.  Please contact an administrator." };
    } else {
        return { "type" : "stream" , "message" : contents.contents };
    }
}

router.post('/', function(req, res, next) {
    res.send(main(req.body.curDirectory, req.body.submit));
});

module.exports = router;