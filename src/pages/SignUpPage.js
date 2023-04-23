import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"
import { useState } from "react"
import axios from 'axios'

export default function SignUpPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('')
  const navigate = useNavigate()

  function cadastrar(e){
    e.preventDefault()

    if(!nome || !senha || !email || !confirmacaoSenha) return alert('Por favor, preencha todos os campos')
    if(senha !== confirmacaoSenha) return alert('As senhas não coincidem')

    const novoUsuario = {
      nome,
      email,
      senha
    }

    axios.post(`${process.env.REACT_APP_API_URL}/cadastro`, novoUsuario)
    .then(res => {
      alert('Cadastro realizado com sucesso!')
      navigate('/')
    })
    .catch(err => alert(err.response.data))
  }

  return (
    <SingUpContainer>
      <form onSubmit={cadastrar}>
        <MyWalletLogo />
        <input onChange={e => setNome(e.target.value)} value={nome} placeholder="Nome" type="text" />
        <input onChange={e => setEmail(e.target.value)} value={email} placeholder="E-mail" type="email" />
        <input onChange={e => setSenha(e.target.value)} value={senha} placeholder="Senha" type="password" autocomplete="new-password" />
        <input onChange={e => setConfirmacaoSenha(e.target.value)} value={confirmacaoSenha} placeholder="Confirme a senha" type="password" autocomplete="new-password" />
        <button>Cadastrar</button>
      </form>

      <Link to='/'>
        Já tem uma conta? Entre agora!
      </Link>
    </SingUpContainer>
  )
}

const SingUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
