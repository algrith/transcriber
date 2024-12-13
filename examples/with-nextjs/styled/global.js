import tw, { theme, GlobalStyles as BaseStyles } from 'twin.macro';
import { Global, css } from '@emotion/react';

const customStyles = css({
  body: {
    WebkitTapHighlightColor: theme`colors.purple.500`,
    fontFamily: 'gilroy-font, sans-serif',
    fontWeight: 'normal',
    color: '#888888',
    fontSize: '13px',
    padding: 0,
    margin: 0,
    ...tw`antialiased`,
  },
  main: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0rem 0',
    display: 'flex',
    flex: 1
  },
  '*': {
    boxSizing: 'border-box',
  }
});

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
);

export default GlobalStyles;