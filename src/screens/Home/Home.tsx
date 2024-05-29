import {Alert, Text, TouchableOpacity, View} from 'react-native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

// 생체 인식 가능 여부
export const booleanBiometricCheck = () => {
  return rnBiometrics
    .isSensorAvailable()
    .then(resultObject => {
      const {available, biometryType} = resultObject;
      if (available && biometryType === BiometryTypes.TouchID) {
        return {result: true, type: biometryType};
      } else if (available && biometryType === BiometryTypes.FaceID) {
        return {result: true, type: biometryType};
      } else if (available && biometryType === BiometryTypes.Biometrics) {
        return {result: true, type: biometryType};
      } else {
        return {result: false, type: null};
      }
    })
    .catch(() => {
      return {result: false, type: null};
    });
};

// 키생성
export const createKey = () => {
  return rnBiometrics
    .createKeys()
    .then(resultObject => {
      const {publicKey} = resultObject;
      return {result: true, key: publicKey};
    })
    .catch(() => {
      return {result: false, key: null};
    });
};

// 키 존재여부
export const checkKey = () => {
  return rnBiometrics
    .biometricKeysExist()
    .then(resultObject => {
      const {keysExist} = resultObject;
      if (keysExist) {
        return true;
      } else {
        return false;
      }
    })
    .catch(() => {
      return false;
    });
};

// 키 삭제
export const deleteKey = () => {
  return rnBiometrics
    .deleteKeys()
    .then(resultObject => {
      const {keysDeleted} = resultObject;

      if (keysDeleted) {
        return true;
      } else {
        return false;
      }
    })
    .catch(() => {
      return false;
    });
};

// 값 확인
export const biometicLogin = (userID: string = '', msg: string = '등록') => {
  return rnBiometrics
    .createSignature({
      promptMessage: msg,
      payload: userID,
    })
    .then(resultObject => {
      const {success, signature} = resultObject;
      if (success) {
        return {result: true, key: signature};
      } else {
        return {result: false, key: null};
      }
    })
    .catch(error => {
      console.log(error);
      return {result: false, key: null, msg: error};
    });
};

const _handleCreateAuth = async () => {
  // const token = await messaging().getToken()
  const token = 'test123';
  const keyCreate = await createKey();
  if (keyCreate?.result) {
    const biometricCheck = await booleanBiometricCheck();
    if (biometricCheck?.result) {
      const bioKey = await biometicLogin('test123', '등록');

      if (bioKey?.key) {
        Alert.alert(
          '알림',
          `생체인증이 성공적으로 등록되었습니다. ${bioKey?.key}`,
        );
      } else {
        Alert.alert('알림', '생체인식 사용불가 또는 등록되어있지 않음.');
      }
    }
  } else {
    Alert.alert('click!', `${keyCreate}`);
    Alert.alert('알림', '생체인식 사용 불가');
  }
};

const _handleLoginBiometric = async () => {
  const token = 'test123';
  const biometricCheck = await booleanBiometricCheck();
  console.log('biometricCheck', biometricCheck);
  if (biometricCheck?.result) {
    try {
      const bioKey = await biometicLogin('test123', '로그인');
      if (bioKey?.result) {
        Alert.alert('알림', `로그인 성공 ${bioKey?.result}`);
      } else {
        Alert.alert('실패', '얼굴이 다름. 다시 시도해주세요.');
      }
    } catch (error) {}
  } else {
    Alert.alert('실패', '생체인식 사용 불가 또는 등록 안됨');
  }
};

const Home = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{alignItems: 'center', marginBottom: 40}}>
        <Text style={{fontSize: 30}}>Chainwith Wallet</Text>
        <Text style={{fontSize: 20}}>Bio Auth Test</Text>
      </View>
      <View>
        <TouchableOpacity
          style={{
            width: 200,
            borderWidth: 1,
            borderRadius: 6,
            alignItems: 'center',
            marginBottom: 20,
            height: 30,
            justifyContent: 'center',
          }}
          onPress={_handleCreateAuth}>
          <Text>생체인증 생성</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 200,
            borderWidth: 1,
            borderRadius: 6,
            alignItems: 'center',
            height: 30,
            justifyContent: 'center',
          }}
          onPress={_handleLoginBiometric}>
          <Text>생체인증 로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
