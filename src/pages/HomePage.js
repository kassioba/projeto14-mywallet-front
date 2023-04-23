import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

export default function HomePage() {
  const token = localStorage.getItem('token') 
  const navigate = useNavigate()
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [transacoesUsuario, setTransacoesUsuario] = useState([])

  useEffect(() => {
    if(!token){
      navigate('/')
      return alert('Por favor, faça login novamente')
    }

    axios.get(`${process.env.REACT_APP_API_URL}/usuario`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => setNomeUsuario(res.data.nome))
    .catch(err => console.log(err))

    axios.get(`${process.env.REACT_APP_API_URL}/transacao`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => setTransacoesUsuario(res.data.reverse()))
    .catch(err => console.log(err))
  },[])

  function calcularSaldo(){
    let entrada = 0;
    let saida = 0;

    for (let i = 0; i < transacoesUsuario.length; i++) {
      if(transacoesUsuario[i]?.tipo === 'entrada'){
        entrada += Number(transacoesUsuario[i]?.valor)
      }
      if(transacoesUsuario[i]?.tipo === 'saida'){
        saida += Number(transacoesUsuario[i]?.valor)
      }
    }

    return entrada - saida
  }

  function logout(){
    axios.delete(`${process.env.REACT_APP_API_URL}/logout`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      localStorage.removeItem('token')
      navigate('/')
    })
    .catch(err => console.log(err))
  }
  
calcularSaldo()

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {nomeUsuario}</h1>
        <BiExit onClick={logout}/>
      </Header>

      <TransactionsContainer>
        <ul>
        {transacoesUsuario.length !== 0 && transacoesUsuario.map(transacao =>(
          <ListItemContainer>
            <div>
              <span>{transacao.dia}</span>
              <strong>{transacao.descricao}</strong>
            </div>
            <Value color={transacao.tipo === 'entrada' ? "positivo" : "negativo"}>{Number(transacao.valor).toFixed(2).replace('.', ',')}</Value>
          </ListItemContainer>
      ))}
        </ul>
          {transacoesUsuario.length === 0 && 
          <div className="vazio">
            Não há registros de entrada ou saída
          </div>}
        {transacoesUsuario.length !== 0 && 
        <article>
          <strong>Saldo</strong>
          <Value color={calcularSaldo() >= 0 ? "positivo" : 'negativo'}>{Math.abs(calcularSaldo()).toFixed(2).replace('.', ',')}</Value>
        </article>}
      </TransactionsContainer>


      <ButtonsContainer>
        <Link to='/nova-transacao/entrada'>
        <button>
          <AiOutlinePlusCircle />
          <p>Nova <br /> entrada</p>
        </button>
        </Link>
        <Link to='/nova-transacao/saida'>
        <button>
          <AiOutlineMinusCircle />
          <p>Nova <br />saída</p>
        </button>
        </Link>
      </ButtonsContainer>

    </HomeContainer>
  )
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  height: 50vh;
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  article {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;   
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
  ul{
    overflow: scroll;
  }
  .vazio{
    width: 180px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #868686;
    font-size: 20px;
  }
`
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;

  a{
    width: 100%;
    padding-top: 0;
  }
  
  button {
    width: 100%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`