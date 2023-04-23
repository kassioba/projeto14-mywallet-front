import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import MyWalletLogo from "../components/MyWalletLogo"
import { useEffect, useState } from "react"
import axios from "axios"

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if(token) navigate('/home')
  },[])

  function login(e){
    e.preventDefault()

    if(!email || !senha) return alert('Por favor, preencha todos os campos')

    axios.post(`${process.env.REACT_APP_API_URL}/login`, {email, senha})
    .then(res  => {
      navigate('/home')
      localStorage.setItem('token', res.data)
    })
    .catch(err => alert(err.response.data))
  }

  return (
    <SingInContainer>
      <form onSubmit={login}>
        <MyWalletLogo />
        <input onChange={e => setEmail(e.target.value)} value={email} placeholder="E-mail" type="email" />
        <input onChange={e => setSenha(e.target.value)} value={senha} placeholder="Senha" type="password" autocomplete="new-password" />
        <button>Entrar</button>
      </form>

      <Link to='/cadastro'>
        Primeira vez? Cadastre-se!
      </Link>
    </SingInContainer>
  )
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
