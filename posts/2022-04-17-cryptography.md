---
title:  "Cryptography: Primitive to Modern"
date:   '2022-04-17'
author: 'Qiping Pan'
description: "shh ..It's classified."
---

>Fun Fact:
 最早对密码学感兴趣是源于初中看的Dan Brown的[《数字城堡》](https://en.wikipedia.org/wiki/Digital_Fortress)。

## 什么是密码学？
密码学（Cryptography）关注信息保密问题，还同时涉及信息完整性验证（消息验证码）、信息发布的不可抵赖性（数字签名）、以及在分布式计算中产生的来源于内部和外部的攻击的所有信息安全问题。
考虑以下几个场景：
1. **保密性 (Confidentiality)**
   Alice向Bob发送了一条信息，但需要通过第三者Mallory传输。然而，Alice和Bob并不想让Mallory知道信息的内容。如何才能让Mallory不能破译信息呢？
3. **信息完整性 (Integrity)**
    Alice向Bob发送了一条信息，但需要通过第三者Mallory传输。然而，Alice和Bob并不想让Mallory篡改信息。Bob如何才能知道收到的信息有没有被篡改呢？
2. **真实性 (Authenticity)**
    Alice向Bob发送了一条信息，但需要通过第三者Mallory传输。如何才能证明这条信息是由Alice发出的，而不是Mallory假冒Alice发出的？

## 保密性

要获得保密性，很基本的想法就是加密(encryption)。加密算法可以理解为一个函数$f$，将信息$m$输入，可以得到一串看似随机的密文(cryption)$e$, i.e. $f(m) = e$。这样 Mallory得到了e，如果不知道$f$, 是无法知道$m$是什么的。而Bob则可以通过$f^{-1}(e)=m$来得到信息明文(plaintext)。

### 古老的加密算法
* **凯撒密码(Ceasar Cipher)**，这个太经典了，把每一位字符按序号加上一个offset后就得到了密文。破解起来也比较简单，可以用频率分析(frequency analysis)，基于在使用是英文字母的频率符合同一分布的假设。比如e在英文中频率出现较高，所以在密文中出现频率最高的很可能代表e。
* **维吉尼亚密码(Vigenère cipher)**，凯撒密码的升级版。凯撒密码对每个字母的偏移量是相同的，而维吉尼亚密码是不同的。这些偏移量也称为密钥（key）$K$。对于明文$P$的每一位字符$P_i$，偏移上对应的$K_i$就得到了密文$C_i$。比如：
  明文：bbbbbbamazon
  密钥：ABC
  偏移：012012012012
  密文：bcdbcdanczpp
破解方法：只需要知道key的长度，就一样可以使用frequency analysis。如何知道key的长度？使用Kasiski examination。思路就是通过找到密文的重复出现的字串，他们之间的距离就是key的整数倍。比如：
**abcdea**bcdeabcdeabcde**abcde**abcdeabc
**crypto** is short for **crypto**graphy.

### 现代的加密算法

通常想一个函数/算法是比较难的，我们可以借鉴维吉尼亚密码的思路，考虑一个函数族，用一个key去取其中的一个函数，这样如果Mallory不知道key，即使知道函数族，也无法确认具体的函数。

* **OTP(one-time pad)**，使用一个很长的随机数组成的key，将明文的每一位和key的每一位做运算（比如xor），得到密文。有点像使用维吉尼亚密码时明文长度小于key的情况。OTP一般是无法破解的，但是使用条件很苛刻：你得有一个够长的key，而且还只能用一次。如果使用两次同样的key，根据xor的性质，即使Mallory不知道他们各自表示什么，把他们xor起来就可以发现[有趣的东西](https://cryptosmith.com/2008/05/31/stream-reuse/)。

* **流加密(Stream Cipher)**，Alice和Bob使用同一个key来生成伪随机加密数据流作为密钥。把密钥和明文用xor加密即可。如果不重复是用key的话，就和OTP效果相同。有以下几个Stream Cipher
  * RC2, RC4: 缺陷是生成的密钥中，每一位上的0/1的概率不均等。
  * Salsa20
* **分组加密(Block Cipher)**, 使用一个固定长度的，可以反复使用的key来分组加密一个长明文。也就是我们需要一个算法$f$使得给定一个key $k$ 和一个n-bit的输入$p$，可以得到一个n-bit的输出block $c = f(k, p)$。这个算法只要知道key就可逆，并且key可以重复使用，但如果不知道key，则没有别的方法能得到$p$。一个简单的思路是使用伪随机排列生成器(psuedorandom permutation generator)，打乱明文的顺序，得到密文。**AES(Advanced Encryption Standard)**, 一个非常复杂的混淆算法，把128-bits的明文通过一系列操作输出一个128-bits的密文。操作包括：把输入的每一位经过一个可逆的非线性变换，移动行，向量运算列，和key进行xor等等。如果明文长度大于一个block，这时候就需要分割成多个block并加上padding补齐成block的整数倍。分组加密有两种方式：
  * **Encrypted Codebook(ECB)**，输入的每一个block独立地进行加密，然后组合起来成为密文。缺陷是明文相同的部分会有相同的密文。
  {% include figure image_path="/assets/images/common/ECB_encryption.png" alt="this is a placeholder image" caption="" %}
    {% include figure image_path="/assets/images/common/ECB_decryption.png" alt="this is a placeholder image" caption="" %}
  * **Cipherblock Chaining(CBC)**，输入的每一个明文block和之前的一个密文block xor之后再加密得到该block的密文。避免了ECB的缺陷，但效率上不能并行。如果和mac一起使用，会遭受padding oracle attack，即通过更改之前一个block的密文，根据得到了invalid mac还是invalid padding来得到对应的明文（如果是invalid mac则说明padding正确，我们可以通过padding设置的惯例来得到对应的明文）。防御的方法也很简单，先加密再mac就好了，这样解密的过程是先检查密文的mac，然后再解密密文，所以无论何时都会返回invalid mac。
{% include figure image_path="/assets/images/common/CBC_encryption.png" alt="this is a placeholder image" caption="" %}
{% include figure image_path="/assets/images/common/CBC_decryption.png" alt="this is a placeholder image" caption="" %}
  * **Counter Mode(CTR)**，对于一个message有一个message-id, 把这个message_id和一个counter 连起来作为一个block加密，然后把输出和明文xor得到密文。也就是一个stream cipher。有点是可以并行。
    {% include figure image_path="/assets/images/common/CTR.png" alt="this is a placeholder image" caption="" %}


## 完整性
如何验证完整性呢？可以参考加密，Alice和Bob协商一个函数$f$，将信息$m$输入，可以得到一串看似随机的验证消息(MAC，message authentication code) $mac$, i.e. $f(m) = mac$。这样 Mallory得到了e，如果不知道$f$, 是无法主动构造$mac$。而Bob则可以通过$f(m)=mac$来确认消息完整。

### 现代的MAC算法

* **HMAC-SHA256**，通过一个哈希函数SHA256得到MAC，算法是对于一个message $m$和key $k$,计算 mac = SHA256(k ^ c1 \|\| SHA256(k ^ c2 \|\| m))，其中^表示xor，\|\|表示字符串连接。

**哈希函数(Hash function)** 把任意长度的字符串映射到一个固定长度的数码上。不用key，因为是单向的，不需要decryption。好的哈希函数的性质有：
* Collision Resistance, 即不容易出现两个输入映射到同一个哈希的情况
* Preimage Resistance, 即知道hash，不容易找到原来的输入
* Second Preimage Resistance, 即对于一个特定的输入，难以找到另外一个输入使得它们hash相同
  
目前可以使用的哈希函数有SHA-256, SHA-512, SHA-3，已经broken的哈希函数有MD5, 
SHA-1。

## 密钥交换算法

注意到Alice和Bob需要有一个共享的密钥，而不能让Mallory知道。所以我们需要一个密钥交换算法，在不泄漏给Mallory的情况下使得Alice和Bob能知道共享的密钥是什么。

### Diffie-Hellman算法

有一个公开的数$g$和一个公开的质数$p$，Alice选一个秘密的数字$a$, Bob选一个$b$, Alice把$g^a \mod p$告诉 Bob, Bob把$g^b \mod p$告诉Alice。密钥即为$g^{ab} \mod p$。原理在于，除非你知道$a$,$b$中的一个，否则你无法从$g^a \mod p$和$g^b\mod p$得到$g^{ab}\ \mod p$ ([discrete log problem](https://en.wikipedia.org/wiki/Discrete_logarithm)是很难的)。这样我们可以防止监听者破解信息。然而，这个还是会受到MITM的影响。MITM和被动监听者的区别在于可以主动干预。如果Mallory在传输过程中选一个m，并把$g^b \mod p$告诉Bob，那么Mallory也可以知道key是什么。
    {% include figure image_path="/assets/images/common/MITM_DH.png" alt="this is a placeholder image" %}

这是一个对称加密的密钥交换算法，因为Alice和Bob所得到的密钥是相同的。对称加密的问题在于，**对于每一个连接都需要独一无二的一个key pair**。有时候为了规模化(scalability)的原因，我们希望不对称。比如一下几个场景：
* 很多人想要验证一个数据，但我们不能公布integrity key，否则所有人都可以改数据然后用integrity key来证明数据是完整且权威的。
* Alice想从很多人哪里获得加密的数据，但不能使用对称的同一个key，否则所有人都可以互相解密。每人一个key又有太多overhead。所以我们需要非对称的key，即自己掌握一个私钥，公布一个公钥。

### RSA算法
1. 选两个很大的随机质数$p$, $q$
2. $N = pq$
3. 选一个$e$使得与$(p-1)*(q-1)$互质
4. 找一个$d$使得$e*d \equiv 1 \bmod (p-1)(q-1)$
5. $(e,N)$为public key，$(d,N)$为private key
6. 加密：$E(x) = x^e \bmod N$ 
   解密： $D(x) = x^d \bmod N$

#### RSA算法的用途
RSA可以用以加密，也可以用以验证信息完整性和真实性。
* 加密：别人用public key 加密, 我用private key 解密
* 验证：我用private key 加密（签署, sign），别人用public key解密

有了验证的功能，我们可以通过RSA来防止MITM攻击。具体方法就是让信息的发送者用private key签署自己的信息，接受者通过public key解密验证是否一致。这样Mallory必须知道private key，重新签署信息才能更改信息的内容。所以可以通过在DH算法过程中用RSA签署$g^a \mod p$, $g^b \mod p$来保证不受MITM的影响，建立一个安全的连接。
#### RSA算法的缺陷
1. 如果两个key pair用了同一个prime，那么就很容易破解着两个key pair
2. key太小，导致$k^e < N$，不能wrap around，所以可以直接开方得到k
3. 太慢了。解决办法是可以用RSA来加密AES的key，然后用block cipher加密后传输。
4. RSA不能向前保密(forward secrecy)。一种可能的通过RSA的key exchange算法是，Alice挑一个随机数，用Bob的public key进行加密，然后发给Bob。有人把这些key的密文保存起来的话，一旦Bob的private key在未来泄漏，那么所有会话的key都会被破解。DH可以向前保密，因为每次会话两个人都可以选不同的key，会话之间没有重复使用的key。