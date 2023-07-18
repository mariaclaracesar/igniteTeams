import { TouchableOpacityProps } from 'react-native';

import * as S from './styles';

type Props = TouchableOpacityProps & {
    title: string;
    type?: S.ButtonTypeStyleProps;
}

export default function Button({ title, type = 'PRIMARY', ...rest}: Props) {
  return (
    <S.Container type={type} {...rest} >
  		<S.Title>
     		 {title}
   		 </S.Title>
    </S.Container>
  );
}

