---
title: "Dots"
subtitle: "\"You can only connect them looking backwards.
\" -- Steve Jobs"
permalink: /experiences/
author_profile: true
header: 
  overlay_image: "assets/images/project_background.jpeg"
expEntries:
  TikTok:
    name: "Front-end Software Engineer Intern"
    time: "May. 2021 - Aug. 2021"
    loc: "TikTok Bytedance"
    locLink: "https://www.bytedance.com/en/"
    tags:
      - txt: "TypeScript"
      - txt: "React.js"
      - txt: "Node.js"
      - txt: "Jest.js"
    sets:
      - bullets:
        - "Mentored by [Jiachen Pan](https://www.linkedin.com/in/%E5%98%89%E6%99%A8-%E6%BD%98-7b7260ba/detail/recent-activity/) and Bo Zhang at TikTok Monetization Team"
        - "Developed automated tests and scripts for continuous delivery."

  BioInformatics:
    name: "Bioinformatics ML Researcher"
    time: "Sep. 2021 - Present"
    loc: "UMich"
    tags:
      - txt: "Python"
      - txt: "C++"
      - txt: "Shell"
      - txt: "Pytorch"
      - txt: "Code"
        link: "https://github.com/ppppqp/Deeplearning_threading/settings"
        ic: "fas fa-code"
    sets:
      - bullets:
          - "Mentored by Zheng Wei and [Brian Athey](https://medicine.umich.edu/dept/dcmb/brian-d-athey-phd) at Michigan Medicine "
      - bullets:
          - "Implemented a robust PBD file parser, feature extractor and processed over 10,000 raw data files"
          - "Constructed a convolutional neural network pipeline that takes sequential andstructural features to predict protein post-translational properties."
  NLP:
    name: "NLP Researcher"
    time: "Oct. 2021 - Present"
    loc: "UMich"
    tags:
      - txt: "Python"
      - txt: "Shell"
      - txt: "Tensorflow"
      - txt: "Code"
        link: "https://github.com/ppppqp/NVIDIA-ELECTRA"
        ic: "fas fa-code"
    sets:
      - bullets:
          - "Mentored by [Jason Mars](https://www.jasonmars.org/)"
      - bullets:
          - "Investigated and designed the adversarial training method to apply on GPT model."
          - "Constructed the data preprocessor and architecture to conduct the experiment."
        media:
            - src: "/assets/images/Exp/GANzs.png"
        #   - src: "https://i.imgur.com/dOTIoru.png"
        #     alt: "Exhaustive search on global optimum pose"
        #   - src: "https://i.imgur.com/Bc7he4M.png"
        #     alt: "Good ICP output given good translation guess, with switched input"
  HCI:
    name: "HCI Researcher"
    time: "Aug. 2021 - Present"
    loc: "UMich"
    tags:
      - txt: "Flask"
      - txt: "React.js"
      - txt: "d3.js"
      - txt: "Code"
        link: "https://github.com/ppppqp/NVIDIA-ELECTRA"
        ic: "fas fa-code"
      - txt: "Demo"
        link: "http://18.116.222.134:8000/"
        ic: "fas fa-chalkboard-teacher"
    sets:
      - bullets:
          - "Mentored by [Tianyi Zhang](https://tianyi-zhang.github.io/) and [Xinyu Wang](https://web.eecs.umich.edu/~xwangsd/)"
      - bullets:
          - "Built a user interface with React.js and MaterialUI to provide various user input to the synthesizer,which generates Tensorflow programs by taking I/O examples and natural language descriptions."
          - "Designed and implemented dataflow diagram for Tensorflow programs, which proved to enhance the users’ understanding of the generated code"
      - media:
            - src: "/assets/images/Exp/HCI.png"
---
{% include page__hero.html %}
<div id="main" role="main">
{% include sidebar.html %}
<article class="page" itemscope itemtype="https://schema.org/CreativeWork">
{% include experiences.html id="NLP" %}
{% include experiences.html id="BioInformatics" %}
{% include experiences.html id="HCI" %}
{% include experiences.html id="TikTok" %}
</article>
</div>