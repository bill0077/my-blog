---
title: "Transformer이란 무엇인가"
date: "2024-04-20"
author: "bill0077"
---

최근 자연어 모델들의 성능이 비약적으로 상승한 것에는 transformer이라는 아키텍쳐가 개발된 것에 있다. 이게 대체 어떤 원리인 건지, 다른 모델과 어떤것이 다른건지 궁금해서 정리해보며 공부하도록 하겠다.
개인적으로 공부한 것을 요약한 것이기에 틀린점이 있을 수 있으며, 사용된 이미지는 직접 제작한 것이 아니라 reference(주로 https://github.com/hkproj/transformer-from-scratch-notes ) 에서 찾은 이미지들로 구성되어 있음을 미리 밝힌다.

## RNN과의 차이점
먼저 transformer과 기존 RNN 방식의 차이를 간단히 알아보자. 기존 자연어 처리에는 RNN 방식이 주로 사용되었다. RNN은 전체 입력에서 i개의 token들을 입력으로 사용해 결과물 token들을 출력하고, 다시 다음 time step에서 i개의 입력 token들을 활용해 결과를 출력하는 과정을 모든 입력을 처리할 때까지 반복한다. 이 과정에서 모델의 hidden state가 변화하며 이전의 정보를 현재에 token 반영한다.
<center>
<img src="___MEDIA_FILE_PATH___/rnn.png" width="80%" title="rnn-workflow"/>
</center>

-> for 문으로 전체 입력 토큰들을 각 time step마다 일정 수만큼 순회하며 결과물을 내놓는 것과 비슷한 방식임

따라서 RNN은 
- for 문으로 입력 토큰들을 순회하며 결과물을 내놓는 방식으로 인하여 긴 입력에 대해 오랜 시간이 필요하게 되고
- 이전 time step에서 입력받은 token들에서 나온 정보들이 step이 지남에 따라 기여도가 점차 적어지기에 활용하는 것이 어렵다(=전체 context를 활용해 추론하는 것이 까다로움).

이외에 긴 계산그래프로 인한 기울기 소멸문제 등도 있다.

-> 위 문제들을 해결하고자 transformer를 활용한 방법이 제시되었다.

# Transformer
<center>
<img src="___MEDIA_FILE_PATH___/transformer.png" width="50%" title="transformer-workflow"/>
</center>

transformer는 input과 ouput 문장을 받아 그 사이 cross attention을 구하는 것으로 학습과 추론을 진행하며, 크게 encoder과 decoder로 이루어져 있다. 위의 그림에서 좌측이 encoder, 우측이 decoder이다. encoder는 input을 가공해 key(=$K$), value(=$V$)를 만들고, decoder는 output으로 부터 query(=$Q$)과 $K$, $V$를 이용해 multi-head attention으로 cross attention을 계산한다. 계산된 cross attention을 전체 단어 목록인 vocab으로 classify하는 linear layer을 거쳐 output 문장과 동일한 길이의 결과물이 도출된다.

이제 위 과정을 차례차례 자세히 알아보자. 이후 글에서는 input과 ouput이 위의 구조도를 거치는 과정을 하나하나 짚어본다.

# Encoder
## Input Embedding
input data가 입력되기 시작하는 input embedding 지점부터 살펴보자. 각 입력 문장들은 1~n개의 단어를 기준으로 tokenize 된다 (여기서는 1개 단어로 tokenize되는 경우만 고려). 그리고 각 token은 고유한 ID를 갖고 있으며, 해당 ID가 길이 512인 vector에 할당된다. 이때 이 vector값이 단어의 의미를 담는다고 볼 수 있고, vector의 값은 모델 학습을 통해 조정된다. 결론적으로 input embedding은 각 token으로부터 vector로의 mapping이다.
<center>
<img src="___MEDIA_FILE_PATH___/input_embedding.png" width="80%" title="input-embedding-process"/>
</center>

## Positional Encoding
각 token에 대해 input embedding이 진행되면  positional encoding이 각 input embedding에 더해진다. 이는 문장에서 각 token들의 위치에 따른 정보를 추가해주는 것으로 "나는 귀여운 고양이를 가지고 있다"와 같은 문장에서 각 token의 위치를 모델이 인식하도록 해준다.

positional encoding은 각 문장에서 token의 순서와 각 token별 embedding vector의 각 원소의 순서 depth에 따른 함수이다. 이때 depth의 홀짝성에 따라 적용되는 함수의 형태가 약간 다르다.

$PE(pos, depth)=
\begin{cases}
\sin\frac{pos}{10000^\frac{2i}{d_{model}}},\;if\;depth = 2i\\
\cos\frac{pos}{10000^\frac{2i}{d_{model}}},\;if\;depth = 2i+1
\end{cases}$

<center>
<img src="___MEDIA_FILE_PATH___/positional_encoding.png" width="80%" title="positional-encoding-process"/>
</center>

주의할 것은 이 positional encoding은 문장이나 token의 내용과는 전혀 상관이 없으며, 오직 위치에 따라 값이 정해지는 개별적인 함수라는 것이다. 따라서 positional encoding은 단 한번 계산 이후 모든 문장에 대해 일괄적으로 적용 가능하다. 앞서 말했듯이 input embedding이 구해지면 각 vector에 같은 크기를 갖는 positional encoding이 더해진다.

positional encoding은 왜 sin과 cos 함수로 이루어져 있을까? pos와 depth(=2i, 2i+1)에 따라 positional endocing 함수를 시각화해보면 위치에 따라 여러 연속적인 패턴이 발생하는 것을 알 수 있는데, 모델이 이 패턴에 따라 token의 위치 별로 다른 정보를 학습하기를 바랐기 때문이다.
<center>
<img src="___MEDIA_FILE_PATH___/pe_visualize.png" width="80%" title="positional-encoding-visualization"/>
</center>

## Self Attention
Multi-Head Attention을 다루기 전에 Self Attention 개념을 먼저 살펴보자.

"나는 귀여운 고양이를 가지고 있다"와 같은 문장에서 '나는'이라는 token은 '고양이'라는 token보다 '가지고 있다'라는 token과 더욱 연관되어 있고, 비슷하게 '귀여운'이라는 token은 '나는'보다 '고양이'와 서로 연관되어 있다. 이렇게 문장 내에서 단어간 연관성을 파악하기 위해 사용되는 것이 Self Attention이다. 

Self Attention은 문장 사이에서 각 token간의 연관성을 찾으므로 Attention을 구하는 식에서 $Q$, $T$, $V$를 전부 input embedding에 positional encoding을 더한, 서로 동일한 행렬로 넣어주면 된다. Attention을 구하는 식은 아래와 같다. 

$Attention(Q, T, V) = softmax(\frac{QK^T}{\sqrt{d_k}})V$

위 식을 시각화하면 아래와 같다. 예제에서는 6 token 문장 "YOUR CAT IS A LOVELY CAT"을 사용한다. 먼저 $Q$와 $K^T$ 를 곱해 각 단어 간 유사성을 계산한다. 이후 $\sqrt{d_{model}}$ 로 나눠 scale을 맞추고 softmax를 취해 이를 확률로 변환한다.
<center>
<img src="___MEDIA_FILE_PATH___/self_attention_1.png" width="80%" title="self-attention-process"/>
</center>

이후 이 값을 다시 $V$와 곱해 줌으로써 특정 token과 다른 모든 token간의 연관성을 포함하게 된다.
<center>
<img src="___MEDIA_FILE_PATH___/self_attention_2.png" width="80%" title="self-attention-process"/>
</center>

Self Attention은 parameter이 없다는 것에 주목해두자 (입력된 행렬을 곱하고 softmax를 취하는 등의 연산만 이루어짐). Multi-head Attention에서는 그렇지 않을 것이다.

## Multi-Head Attention
Multi-head attention은 self attention에서 head라는 개념이 추가된다. Multi-head attention에서는 $Q$, $K$, $V$ 값을 그대로 이용하지 않고 각각에 가중치를 곱하는 과정을 거친다(=학습 가능한 파라미터가 적용됨). 그리고 이 결과물을 여러 sub sequence로 쪼개게 된다. 이때 각 sub sequence 들은 input embedding의 일부만을 포함한다 (=sub sequence는 문장의 token별로 자르는 것이 아니라 token을 여러개로 분할한 전체 문장이다). 이렇게 구해진 sub sequence들을 각각 Attention에 적용해 head라는 것을 얻게 되고, 얻게 된 head들을 concatenate해 하나의 head로 만든다. 최종적으로 $Q$, $K$, $V$ 에서 했던것처럼 다시 가중치를 곱하고, 이를 통해 얻게된 $d_{model} * d_{model}$ 행렬이 우리가 얻고자 하는 multi-head attentiond의 값이다. 아래 그림에서 multi-head attention의 과정이 쉽게 표현되어 있다.
<center>
<img src="___MEDIA_FILE_PATH___/multi_head_attention.png" width="80%" title="self-attention-process"/>
</center>

multi-head attention를 하나의 input sequence를 각 sub head별로 다른 sub sequence를 가지므로 하나의 문장을 서로 다른 측면에서 볼 수 있도록 해준다고 한다.

## Layer Normalization
<center>
<img src="___MEDIA_FILE_PATH___/layer_normalization.png" width="80%" title="layer-normalization-process"/>
</center>

이후 layer nomrmalization이 진행된다. batch normalization과 다르게 각 각 token별로 정규화가 이루어진다.이후 gamma를 곱하고 beta를 더하는 작업이 이루어질 수 있다.

# Decoder
## Masked Multi-Head Attention
<center>
<img src="___MEDIA_FILE_PATH___/masked_multi_head_attention.png
" width="60%" title="masked-multi-head-attention-process"/>
</center>

masked multihead attention은 multihead attention과 비슷하지만 각 token들이 미래의 token은 고려하지 않는다는 것이 다르다 (이는 inference과정과 연관이 있다). multi-head attention에서는 각 $Q$, $K$, $V$들을 여러개로 쪼개고, 각각에 대해 attention 식을 적용했다. masked multi-head attention에서는 이때 각 sub head들을 만들면서 대각선 위쪽의 값들은 -inf 값을 더해 softmax를 취한 결과가 0이 되도록(=mask하여) 만들어준다. 이후에는 다시 각 sub head들을 하나로 concatenate하여 masked multihead attention가 완료된다.

이후 다시 multi head attention을 거치는데, 앞전에 masked multihead attention결과는 decoder에서 $Q$값으로 사용되고, $K$, $V$는 encoder에서 multihead attention이 적용된 결과에서 사용된다. 이로써 input 문장과 output 문장간의 cross attention이 생성되고, 추후에 이를 활용해 학습을 진행할 수 있게된다.

## Linear
decoder에서 cross attention이 생성되었다면, 이를 활용해 우리의 vocab에서 결과 문장을 출력해야 한다. decoder의 cross attention은 feed forward를 거치고 이후 Linear layer를 통해 가장 적절한 출력을 vocab 목록에서 골라낸다.

# Training
한국어->영어 번역기를 예를 들어 훈련 과정을 살펴보자. "나는 고양이를 좋아한다"라는 문장은 "I like cats"라는 문장으로 번역되어야 한다. 이때 input 문장 앞뒤에 \<start>과 \<end> token을 추가해 "\<start> 나는 고양이를 좋아한다 \<end>"가 encoder를 거쳐 $K$, $V$가 얻어지고, "I like cats"는 \<start>를 추가해 "\<start> I like cats"로부터 $Q$가 masked multihead attention을 통해 얻어진다. 

이렇게 얻은 $Q$, $K$, $V$를 multi-head attention하여 input 문장과 ouput 문장간의 cross attention을 구하고, linear layer를 통해 vocab으로 구성된 결과물이 구해질 것이다. 우리는 산물을 우리가 원하는 결과인 "I like cats"에 \<end> 토큰을 더한 "I like cats \<end>"와의 cross entropy를 구하고 역전파하여 모델을 학습할 수 있다.

# Inference
이번에는 모델이 input 만으로 결과를 inference하는 과정을 살펴보자. 이번에는 transformer에 input 문장으로는 "\<start> 나는 고양이를 좋아한다 \<end>"를 넣지만, ouput으로는 "\<start>"만 주어진다. 만일 모델이 잘 훈련되었다면, 결과물은 "I"가 될 것이다. 이제 다시 얻어진 I를 output으로 다시 이용해 model을 돌린다. input은 아까와 동일하지만, output 문장은 "\<start> I"로 다시 모델을 돌리면 결과물은 "I like"가 될 것이다. 이것을 문장 끝에 \<end> token이 나올 때까지 계속 반복하며, 결국 "I like cats \<end>"와 같은 결과가 얻어질 것이다.

이때 softmax의 결과물로 가장 적합한 1개의 token이 아니라 적합한 n개의 token을 전부 고려해 탐색하는 beam search 등의 방식이 적용 가능하다.

# 마무리
이렇게 transformer의 구조와 훈련, 예측이 이루어지는 과정을 간단히 살펴보았다. 추상적으로만 알고 있던 position encoding, multi-head attention 등의 개념을 행렬 변환 수준에서 살펴보니 더욱 심도있는 이해가 되는 것 같다.

**P.S.** 이 글은 이해한 것을 되새김하기 위해 축약해놓은 것이라 가독성이 좋지 않다. 직접 reference의 영상을 보면 보다 명확히 이해할 수 있을 것이다.

## reference
Umar Jamil, 
Attention is all you need (Transformer) - Model explanation (including math), Inference and Training: https://www.youtube.com/watch?v=bCz4OMemCcA

hkproj, transformer-from-scratch-notes: https://github.com/hkproj/transformer-from-scratch-notes