// SPDX-License-Identifier: AGPL-3.0-or-later
/*
 * Copyright (C) 2023 YAAS Dons Hackathon Team
 */

import { exec } from 'child_process';

const USAGE: string = "Usage: tgpt [command]"
const DEFAULT_WORD_LIMIT: number = 150;
const LONG_WORD_LIMIT: number = 500;

function get_key(): string
{
	const key: string | undefined = process.env["OPENAI_API_KEY"];
	if (key === undefined) {
		console.log("error: can not access key");
		process.exit(-1);
	}

	return key;
}

function gpt(cmd: string, sz: number): string
{
	/* to be implemented */
	return "foobar";
}

function check_cmd(cmd: string, callback: (exit_status: number) => void): void
{
	/* discard input by redirecting to `/dev/null` */
	const bash_script: string = "man " + cmd + " >/dev/null 2>&1; echo $?";
	exec(bash_script, (err, stdout, stderr) => {
		if (err) {
			console.error(`exec error: ${err}`);
			return callback(1);
		}

		if (stdout.trim() === "0")
			callback(0);
		else
			callback(1);
	});
}

function main(): number
{
	let fflag: boolean = false;
	let lflag: boolean = false;
	let sz: number = DEFAULT_WORD_LIMIT;

	const argv: string[] = process.argv.slice(1);
	const argc: number = argv.length;
	if (argc < 2 || argc > 5) {
		console.log("error: invalid arguments");
		console.log(USAGE);
		process.exit(-1);
	}

	if (new Set(argv.slice(1)).size !== argv.slice(1).length) {
		console.log("error: duplicated flags");
		process.exit(-1);
	}

	if (argv.includes("-s") && argv.includes("-l")) {
		console.log("error: size mismatch");
		process.exit(-1);
	}

	for (let i = 2; i < argc; i++) {
		if (argv[i] == "-f") {
			fflag = true;
		} else if (argv[i] == "-l") {
			lflag = true;
			sz = LONG_WORD_LIMIT;
		} else if (argv[i] == "-s") {
			sz = Number(argv[i + 1]);
			if (sz < 0) {
				console.log("error: size can't be less than 0");
				process.exit(-1);
			}
			i++;
		} else {
			console.log("tgpt: invalid option %s", argv[i]);
			process.exit(-1);
		}
	}

	const cmd: string = argv[1];
	if (!fflag) {
		check_cmd(cmd, (ret: number) => {
			if (ret) {
				console.log("error: no entry for %s", cmd);
				process.exit(-1);
			}
		});
	}

	return 0;
}

main();
