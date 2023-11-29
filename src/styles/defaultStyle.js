export default {
  control: {
    color: '#fff',
    backgroundColor: '#57BBF5',
    fontSize: 14,
    fontWeight: 'normal',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },

  '&multiLine': {
    control: {
      //   fontFamily: 'monospace',
    },
    highlighter: {
      //   border: '1px solid transparent',
    },
    input: {
      background: 'transparent',
    },
  },

  suggestions: {
    zIndex: 2,
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
};
