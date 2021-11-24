---
title:  "Pitfalls in Installing Local Python"
date:   2021-11-22 21:29:23 +0800
categories: Note common 
---

> Some fun stuff I went through trying to install a local python on a shared linux machine



## Why local python?

So normally the python is stored in usr/bin/python. However, when you are using a shared machine, you do not have the write access to that directory, which makes it awkward to do customizations like changing the python's version (package install is good with virtual environment).
Therefore, I decided to install my own python under my own directory, instead of the system's directory. However, I found there's no comprehensive tutorial on this, so I would like to share my experience with you.

## What happens when you call `python`?

Python is actually an executable file, which source code is written in c++. When we type `python` in the command line, the systems look up the `$PATH` variable to get the correct python file, and execute that file. Therefore, all we need to do is to compile a python and redirect the system call to that python. It seems easy, right? But it turns out to cost me much time in reality.


## Steps in Getting a Local Python Compiled
### Step1. Install and Compile Python
The first step is to get the latest python package ready in your intended directory. For example, if I want to install python 3.9 in `path/to`, I will navigate to [Python Downloading Page](https://www.python.org/downloads/), choose the python 3.9.9 and click the download button next to it. 

{% include figure image_path="/assets/images/common/python_1.png" alt="this is a placeholder image" caption="" %}

This hopefully get us to the downloading page for this specific version. Then I will use the web browser dev tool to get the link of downloading this file. Specifically, I right click on the downloading text and choose inspect. On the panel there is the link associated with the text.


{% include figure image_path="/assets/images/common/python_2.png" alt="this is a placeholder image" caption="" %}

In the shell of your remote machine, making sure that you are in the right directory, type
``` bash
$ pwd
# output: path/to

$ wget https://www.python.org/ftp/python/3.9.9/Python-3.9.9.tgz"
```

This download the tarball (i.e. the compressed version) of python source code. After the downloading completed, you can decompress it with

```bash
tar zxvf Python-3.9.9.tgz
```

You can see a folder named Python-3.9.9 appears under the current directory. `cd` into it to get it compiled. However, to install it locally, you have to add the option of `--prefix` to indicate the path to install

```bash
$ ./configure prefix=/path/to/python
```
Run `make` and `make install` to compile the files

```bash
$ make
$ make install
```

So far, the python should be ready. If you navigate inside `path/to/python` you should see there's an executable file called `python3`. If you execute that file, it should run python shell:

```bash
$ ./python3
Python 3.9.7 (default, Nov 23 2021, 21:32:27) 
[GCC 4.8.5 20150623 (Red Hat 4.8.5-44)] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 
```

However, if you type `which python`, it can not find the correct python. This is because we haven't told the system where to look up python.



### Step2. Tell the system which python to run

Of course you can do `/path/to/python` to run this python everytime, but it is less straight forward than just typing `python`. We will add this path to `$PATH` variable so that the systems know what to do when we use `python`.

```bash
$ echo export PATH=/path/to/python/bin:$PATH >> ~/.bash_profile
$ echo export PYTHONPATH=path/to/python/bin >> ~/.bash_profile
$ source ~/.bash_profile
```

These commands will tell the system that everytime I log in, it should add this python path to the global `$PATH` variable, so that I can run the correct python. Now try again `which python`

```bash
$ which python3
/path/to/python

$ python3
Python 3.9.7 (default, Nov 23 2021, 21:32:27) 
[GCC 4.8.5 20150623 (Red Hat 4.8.5-44)] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 
```


### Some Other Issues:
During the installation, I have also met another issue: I literally can not use pip to install anything. The error messages are:
``` bash
$ pip3 install some-package
pip is configured with locations that require TLS/SSL,
however the ssl module in Python is not available.
Collecting <package>
  Could not fetch URL https://pypi.org/simple/<package>/: 
  There was a problem confirming the ssl certificate: 
  Can't connect to HTTPS URL because the SSL module is not available. - skipping
```
The solutions online includes:
1. [use a flag to disable ssl](https://stackoverflow.com/a/29751768)
2. [upgrade your pip](https://stackoverflow.com/a/58789809)
3. [add conda to path](https://stackoverflow.com/a/54897379)
4. [use yum or apt-get to install some basic lib](https://stackoverflow.com/a/49696062)

None of the works for me. The root of this issue is that `ssl` module,  which is required for `pip` to access online resources, is not available. But we can not install `ssl` with `pip` as well. The method I finally use was to also install a local `openssl` and build python based on that.

On observing the build log for python, I found this line:
```bash
    Could not build the ssl module!
    Python requires a OpenSSL 1.1.1 or newer
```

So my pip failed because when building the python, it can not build the `ssl` module due to the incompatibility with the default `openssl` version. I checked the `openssl` version:

```bash
$ openssl version
OpenSSL 1.0.2k-fips  26 Jan 2017
```
Okay so its 1.0.2 vs the required 1.1.1. I download the openssl 1.1.1g with the steps in this [site](https://help.dreamhost.com/hc/en-us/articles/360001435926-Installing-OpenSSL-locally-under-your-usernamecomman)

Breifly speaking, it is:
1. wget as usual: `wget https://www.openssl.org/source/openssl-1.1.1g.tar.gz`
2. decompress: `tar zxvf openssl-1.1.1g.tar.gz`
3. navigate into and compile:
   ```
   $ cd openssl-1.1.1g
   $ ./config --prefix=/home/username/openssl --openssldir=/home/username/openssl no-ssl2
   $ make
   $ make install
   ```
4. update path: 
    ```bash
    export PATH=$HOME/openssl/bin:$PATH
    export LD_LIBRARY_PATH=$HOME/openssl/lib
    export LC_ALL="en_US.UTF-8"
    export LDFLAGS="-L /home/username/openssl/lib -Wl,-rpath,/home/username/openssl/lib"
    ```


Finally, once I had the openssl working, I re-installed the python with the openssl:
```bash
$ pwd
/path/to/python
$ ./configure prefix=/path/to/install/python --with-openssl=/home/username/openssl
$ make
$ make install
``` 