import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import { useNavigate } from 'react-router-dom';
import './Error.scss';

const Error = () => {
    const navigate = useNavigate();

    return (
        <div className="error-page">
            <SentimentVeryDissatisfiedIcon sx={{ fontSize: '150px' }} />
            <div className="status mt-3 mb-1">404</div>
            <div className="message-01 mb-3">Página não encontrada</div>
            <div className="message-02">A página que você está procurando não existe ou outro erro ocorreu.</div>
            <div className="message-03 mb-3">Volte a página anterior e tente novamente.</div>
            <ButtonUnstyled onClick={() => navigate("/")}
                className="left-button">VOLTAR</ButtonUnstyled>
        </div>
    );
};

export default Error;