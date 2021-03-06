import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';

const apiServer = process.env.REACT_APP_API_SERVER;
const default_Loading = "Loading...";
const thread_hold = 0.8; // bad words contains or not

function SystemChat({ text, scrollToBottom, possibility, noChange }) {
  const [transForm, setTransForm] = useState({ __html: default_Loading });

  // ComponentDidMount
  useEffect(() => {
    if (isLoadEnded()) return;

    console.log(text, possibility);

    var url;
    var data;
    if (possibility === false) {
      console.log("JUDGE");
      url = `${apiServer}/api/bwai/v1/judge/demo`;
      data = {
        'text': text
      }

      Axios.post(url, data)
        .then((res) => {
          console.log(res);
          const Judge = res.data.result.judge;
          var string;

          string = `<p class="SystemChatTitle">`;
          string += `BWAI API의 결과<br/>`;

          if (Judge) {
            string += `문장에는 욕이 있습니다! 🔴`;
          } else {
            string += `문장에는 욕이 없습니다! 🔵`;
          }
          string += `</p>`;

          // if (Judge) {

          // }
          // // if (res.data.result.judge)
          if (noChange) {
            string = `<p class='SystemChatContents'>${text}</p>`;
          }
          setTransForm({ __html: string });
        })
    } else {
      console.log("Probability");
      url = `${apiServer}/api/bwai/v1/probability/demo`;
      data = {
        'text': text
      }

      Axios.post(url, data)
        .then((res) => {
          console.log(res);
          var string = makeInnerHTML(res.data.result);
          console.log(string);
          if (noChange) {
            string = `<p class='SystemChatContents'>${text}</p>`;
          }

          setTransForm({ __html: string });

        })
    }

  })

  useEffect(() => {
    scrollToBottom();
  }, [transForm, scrollToBottom])

  const isLoadEnded = () => transForm.__html !== default_Loading;
  const makeInnerHTML = (result) => {
    var contain_bad_words = result.probability.bad >= thread_hold;
    var sign_bad_words = contain_bad_words ? "있" : "없";
    var circle_bad_words = contain_bad_words ? " 🔴" : " 🔵";

    var string = `<p class="SystemChatTitle">`;
    string += `BWAI API의 결과<br/>`;
    string += `문장에는 욕이 ${sign_bad_words}습니다!`;
    string += `${circle_bad_words}`;
    string += `</p>`;

    if (contain_bad_words && possibility) {
      var prob_per_token = result.prob_per_token;
      var tokens = result.tokens;

      string += parseTokens(prob_per_token, tokens);
    }

    return string;
  }

  const parseTokens = (prob_per_token, tokens) => {
    tokens = tokens.map((data) => data.replace("##", ""));

    var string = `<p class='SystemChatContents'>`;

    var word_thread_hold = 1 / tokens.length;

    for (var i = 0; i < tokens.length; i++) {
      if (prob_per_token[i] >= word_thread_hold) {
        string += `<span class="highlight">${tokens[i] + " "}</span>`
      } else {
        string += tokens[i] + " ";
      }
    }

    string += "</p>"

    return string;
  }

  return <React.Fragment>
    <SystemInfo>
      <SystemFace src={require("../../assets/Chat_BWAI_icon.svg")} alt="" />
      <SystemName>BWAI</SystemName>
    </SystemInfo>
    <ChatSystemTextWrapper dangerouslySetInnerHTML={transForm} />
  </React.Fragment>
}

function UserChat({ text }) {
  return <ChatUserTextWrapper>
    <ChatUserText>{text}</ChatUserText>
  </ChatUserTextWrapper>
}

const ChatTextWrapper = styled.div`
  display: inline-block;
  max-width: 65%;
  font-family: NanumBarunGothic;
  border-radius: 8px;
  font-size: 18px;
  line-height: 30px;
  margin-bottom: 8px;
`

const ChatUserTextWrapper = styled(ChatTextWrapper)`
  float: right;
  margin-right: 24px;
  background-color: #B2CCFA;
`

const ChatSystemTextWrapper = styled(ChatTextWrapper)`
  float: left;
  margin-left: 24px;
  border: 1px solid #A300CB;
  padding: 8px;
  word-break: break-all;
`

const ChatUserText = styled.p`
  padding: 8px;
  margin: 0;
`

const SystemInfo = styled.div`
  margin-left: 24px;
  height: 32px;
  margin-bottom: 4px;
`

const SystemFace = styled.img`
  height: 100%;
  vertical-align: middle;
  margin-right: 4px;
`

const SystemName = styled.p`
  display: inline-block;
  margin: 0;
  font-family: NanumBarunGothicBold;
`

export {
  UserChat,
  SystemChat
}