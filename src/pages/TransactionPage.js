import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { NumericFormat } from "react-number-format"
import axios from "axios"

export default function TransactionsPage() {
  const token = localStorage.getItem('token') 
  const navigate = useNavigate()
  const params = useParams()

  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')

  useEffect(() => {
    if(!token){
      navigate('/')
      alert('Por favor, faça login novamente')
    }
  },[])

  function enviarOperacao(e){
    e.preventDefault()

    if(!valor || !descricao) return alert('Por favor, preencha todos os campos')

    const valorFormatado = valor.replace("R$", "").replaceAll(",", "");

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/transacao/${params.tipo}`,
        {
          valor: valorFormatado,
          descricao,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        alert("Transação realizada com sucesso!");
        navigate("/home");
      })
      .catch((err) => {
        alert(
          "A transação não pôde ser completada. Por favor, tente novamente após alguns minutos."
        );
        console.log(err.response.data);
      });
  }
  
  return (
    <TransactionsContainer>
      <h1>Nova {params.tipo.replace('i', 'í')}</h1>
      <form onSubmit={enviarOperacao}>
        <NumericFormat onChange={e => setValor(e.target.value)} value={valor} thousandSeparator={true} prefix="R$" allowNegative={false} placeholder="Valor" type="text"/>
        <input onChange={e => setDescricao(e.target.value)} value={descricao} placeholder="Descrição" type="text" />
        <button>Salvar {params.tipo.replace('i', 'í')}</button>
      </form>
    </TransactionsContainer>
  )
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`
