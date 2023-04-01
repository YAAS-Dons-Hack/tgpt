// SPDX-License-Identifier: AGPL-3.0-or-later
/*
 * Copyright (C) 2023 YAAS Dons Hackathon Team
 */

import { exec } from 'child_process';

const USAGE: string = "Usage: tgpt [command]"

function get_key(): string
{
	const key: string | undefined = process.env["OPENAI_API_KEY"];
	if (key === undefined) {
		console.log("error: can not access key");
		process.exit(-1);
	}

	return key;
}

function gpt(cmd: string): string
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
	const argv: string[] = process.argv.slice(1);
	const argc: number = argv.length;
	if (argc != 2) {
		console.log("error: invalid arguments");
		console.log(USAGE);
		process.exit(-1);
	}

	const cmd: string = argv[1];
	check_cmd(cmd, (ret: number) => {
		if (ret) {
			console.log("error: no entry for %s", cmd);
			process.exit(-1);
		}
	});

	return 0;
}

main();
