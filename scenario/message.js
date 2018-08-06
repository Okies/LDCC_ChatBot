module.exports = {
  basic: {
    type: 'buttons',
    buttons: [
      '등록하기',
      '내 정보'
    ]
  },
  start: {
    message: {
      text: '원하시는 항목을 선택해주세요.'
    },
    keyboard: {
      type: 'buttons',
      buttons: [
        '등록하기',
        '내 정보'
      ]
    }
  },
  name: {
    message: {
      text: '이름을 입력해주세요.',
    }
  },
  phone: {
    message: {
      text: '연락처를 입력해주세요.'
    }
  },
  password: {
    message: {
      text: '비밀번호를 입력해주세요.'
    }
  },
  login_phone: {
    message: {
      text: '핸드폰 번호를 입력해주세요.'
    }
  },
  login_password: {
    message: {
      text: '비밀번호를 입력해주세요.'
    }
  },
  show: function(context, key) {
    const {u_name, u_phone} = context;
    const u_key = key;
    return {
      message: {
        text: '☆ 나의 수면 패턴 ☆\nhttp://ec2-13-209-205-115.ap-northeast-2.compute.amazonaws.com:8080/lsleep/?u_key=' + u_key
      },
      keyboard: {
        type: 'buttons',
        buttons: [
          '등록하기',
          '내 정보'
        ]
      }
    }
  },
  fail_phone: {
    message: {
      text: '가입되지 않은 번호입니다.'
    },
    keyboard: {
      type: 'buttons',
      buttons: [
        '다시입력',
        '처음으로'
      ]
    }
  },
  fail_password: {
    message: {
      text: '비밀번호를 잘못 입력하셨습니다.'
    },
    keyboard: {
      type: 'buttons',
      buttons: [
        '다시입력',
        '처음으로'
      ]
    }
  },
  reset: {
    message: {
      text: '기존에 입력한 정보가 있습니다.\n기존 정보를 지우고 새로 입력하시겠습니까?'
    },
    keyboard: {
      type: 'buttons',
      buttons: [
        '네',
        '아니오'
      ]
    }
  }
}
