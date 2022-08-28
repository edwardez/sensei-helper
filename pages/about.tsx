import BuiLinedText from 'components/bui/text/BuiLinedText';

const about = () => {
  return <>
    <BuiLinedText><div>What is Sensei Helper?</div></BuiLinedText>
    <BuiLinedText showVerticalDividerPrefix={false}>
      <div>Sensei helper is a tool that help you optimize farming equipments.</div>
    </BuiLinedText>
    <BuiLinedText><div>Is it free to use?</div></BuiLinedText>
    <BuiLinedText showVerticalDividerPrefix={false}>
      <div>Yes! This app is free to use and&nbsp;
        <a href="https://github.com/edwardez/sensei-helper" target="_blank" rel="noopener noreferrer">open-sourced</a></div>
    </BuiLinedText>
    <BuiLinedText><div>How to contact you?</div></BuiLinedText>
    <BuiLinedText showVerticalDividerPrefix={false}>
      <div>Please contact us on&nbsp;<a href="https://twitter.com/sensei_helper" target="_blank" rel="noopener noreferrer">Twitter</a>
        &nbsp;or&nbsp;<a href="https://github.com/edwardez/sensei-helper/issues" target="_blank" rel="noopener noreferrer">Github</a></div>
    </BuiLinedText>
  </>;
};

export default about;
