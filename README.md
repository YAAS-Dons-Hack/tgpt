# tgpt

A terminal based program that generates descriptive usage of specific commands.

# Installation

```shell
$ git clone https://github.com/YAAS-Dons-Hack/tgpt.git
$ cd tgpt
$ make install
```

# Usage

To use this program, you need an OpenAI API key. To add the key as an
environment variable, run the following in the shell:

```shell
$ echo "export OPENAI_API_KEY='yourkey'" >> ~/.bashrc
$ source ~/.bashrc
$ exec bash
```

Then, you can execute by running:

```shell
$ tgpt [command] [options]
```

Options:
`-f`            force to run the command without checking
`-l`            set output size to 500 words (default: 150)
`-s [size]`     manually set output size

# Contribute

## Environment

```shell
$ git clone https://github.com/YAAS-Dons-Hack/tgpt.git
$ cd tgpt
$ npm install
```

## Make rules

### Compile

```shell
$ make
```

### Execute

```shell
$ make run ARG=foobar
```

### Clean up

```shell
$ make clean
```

# License

tgpt is licensed under [AGPL](https://www.gnu.org/licenses/agpl-3.0.en.html), as
included in the [LICENSE](LICENSE) file.

- Copyright (C) 2023 YAAS Dons Hackathon Team
    * Andrew Diep <adiep@dons.usfca.edu>
    * Alexander Leon <aleon7@dons.usfca.edu>
    * Su Nam <snam3@dons.usfca.edu>
    * Yiyu Zhou <yiyuzhou155@dons.usfca.edu>

Please see the Git history for individual authorship information.
