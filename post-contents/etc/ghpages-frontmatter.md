---
title: "gh-pages에서 frontmatter에 의해 deploy가 안되는 경우"
date: "2024-02-19"
author: "bill0077"
---

마크다운을 이용해서 블로그 포스팅을 구현하고 frontmatter을 사용하지만 deploy 할때 frontmatter의 date가 형식에 맞지 않는다고 deploy가 안될줄은 몰랐다..
내부적으로 date를 string으로 놔두면 그냥 표시하도록 frontmatter을 처리하는 logic을 따로 뒀기에 development 환경과 serve에서도 문제가 없었지만 gh-pages에서 deploy 할 때는 이런 것을 확인하는 것 같다. (추후 확인 필요)

deploy가 제대로 안될 때는 deploy error msg부터 확인하자