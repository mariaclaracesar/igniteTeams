import { TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import * as S from './styles';
import ButtonIcon from '@components/ButtonIcon';

type Props = {
  name: string;
	onRemove: () => void;
};

export default function PlayerCard({ name, onRemove }: Props) {
  return (
    <S.Container>
      <S.Icon 
				name="person"
			/>
			<S.Name>
				{name}
			</S.Name>

			<ButtonIcon 
				icon='close'
				type='SECONDARY'
				onPress={onRemove}
			/>
    </S.Container>
  );
}

