# Integração Flask + Supabase Auth

Este guia mostra como integrar sua API Flask existente com a autenticação do Supabase.

## 1. Configuração da API Flask

### Instalar dependências necessárias:
```bash
pip install pyjwt requests python-dotenv
```

### Adicionar validação JWT no Flask:

```python
# auth_middleware.py
import jwt
import requests
from functools import wraps
from flask import request, jsonify, current_app
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = "https://vatmuwktcouvpstqhbih.supabase.co"
SUPABASE_JWT_SECRET = None  # Será obtido dinamicamente

def get_jwt_secret():
    """Obtém a chave pública JWT do Supabase"""
    global SUPABASE_JWT_SECRET
    if not SUPABASE_JWT_SECRET:
        try:
            response = requests.get(f"{SUPABASE_URL}/rest/v1/")
            jwks_url = f"{SUPABASE_URL}/auth/v1/jwks"
            jwks_response = requests.get(jwks_url)
            # Para simplicidade, vamos usar a anon key para validação básica
            SUPABASE_JWT_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdG11d2t0Y291dnBzdHFoYmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDkzMzEsImV4cCI6MjA3MTIyNTMzMX0.VT86RuWv6CrDAN80LHdY_nxGfb5aIqQfPUZFN9LYdJ8"
        except:
            SUPABASE_JWT_SECRET = "fallback_secret"
    return SUPABASE_JWT_SECRET

def verify_token(token):
    """Verifica se o token JWT é válido"""
    try:
        # Para tokens do Supabase, precisamos fazer uma verificação mais robusta
        # Aqui está uma versão simplificada - recomendo usar a biblioteca supabase-py
        payload = jwt.decode(
            token, 
            options={"verify_signature": False},  # Para desenvolvimento
            algorithms=["HS256"]
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def require_auth(f):
    """Decorator para proteger rotas que precisam de autenticação"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Verificar header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Remove "Bearer "
            except IndexError:
                return jsonify({'message': 'Token inválido'}), 401
        
        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401
        
        payload = verify_token(token)
        if payload is None:
            return jsonify({'message': 'Token inválido ou expirado'}), 401
        
        # Adicionar informações do usuário ao request
        request.current_user = payload
        return f(*args, **kwargs)
    
    return decorated_function
```

### Usar o middleware nas suas rotas:

```python
# app.py
from flask import Flask, jsonify, request
from auth_middleware import require_auth

app = Flask(__name__)

@app.route('/api/tickets', methods=['GET'])
@require_auth
def get_tickets():
    """Rota protegida - só usuários autenticados podem acessar"""
    user_id = request.current_user.get('sub')  # ID do usuário do Supabase
    
    # Sua lógica existente aqui
    tickets = get_user_tickets(user_id)  # Sua função existente
    
    return jsonify(tickets)

@app.route('/api/tickets', methods=['POST'])
@require_auth
def create_ticket():
    """Criar novo ticket"""
    user_id = request.current_user.get('sub')
    ticket_data = request.get_json()
    
    # Adicionar user_id ao ticket
    ticket_data['user_id'] = user_id
    
    # Sua lógica existente
    new_ticket = create_new_ticket(ticket_data)
    
    return jsonify(new_ticket), 201

@app.route('/api/profile', methods=['GET'])
@require_auth
def get_profile():
    """Obter perfil do usuário"""
    user_info = request.current_user
    
    return jsonify({
        'user_id': user_info.get('sub'),
        'email': user_info.get('email'),
        'role': user_info.get('role', 'user')
    })

if __name__ == '__main__':
    app.run(debug=True)
```

## 2. Configuração de CORS (se necessário)

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])  # URL do seu frontend
```

## 3. Método Mais Robusto (Recomendado)

Para uma implementação mais robusta, use a biblioteca oficial:

```bash
pip install supabase
```

```python
# auth_supabase.py
from supabase import create_client
import os

SUPABASE_URL = "https://vatmuwktcouvpstqhbih.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdG11d2t0Y291dnBzdHFoYmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDkzMzEsImV4cCI6MjA3MTIyNTMzMX0.VT86RuWv6CrDAN80LHdY_nxGfb5aIqQfPUZFN9LYdJ8"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def verify_supabase_token(token):
    """Verifica token usando a biblioteca oficial do Supabase"""
    try:
        user = supabase.auth.get_user(token)
        return user.user if user else None
    except Exception as e:
        print(f"Erro na verificação do token: {e}")
        return None
```

## 4. Frontend: Fazendo Chamadas Autenticadas

No frontend React, use o `ApiClient` que foi criado:

```typescript
import { apiClient } from '@/utils/apiClient';

// Exemplo de uso em um componente
const loadTickets = async () => {
  try {
    const tickets = await apiClient.getTickets();
    setTickets(tickets);
  } catch (error) {
    console.error('Erro ao carregar tickets:', error);
  }
};
```

## 5. Testando a Integração

1. Faça login no frontend
2. Abra o Developer Tools e vá para Network
3. Faça uma chamada para sua API
4. Verifique se o header `Authorization: Bearer <token>` está sendo enviado
5. Na sua API Flask, adicione logs para verificar se o token está sendo recebido

## Próximos Passos

- Configure seu banco de dados existente para incluir `user_id` nas tabelas relevantes
- Implemente autorização baseada em roles se necessário
- Configure refresh tokens para sessões de longa duração
- Adicione logs e monitoramento para debugging