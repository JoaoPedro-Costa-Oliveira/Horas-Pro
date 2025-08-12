from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../frontend')
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///horas.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo do Banco de Dados - Sem alterações
class RegistroHora(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String(10), nullable=False)
    entrada = db.Column(db.String(5), nullable=False)
    saida_almoco = db.Column(db.String(5), nullable=True)
    retorno_almoco = db.Column(db.String(5), nullable=True)
    saida = db.Column(db.String(5), nullable=False)
    observacoes = db.Column(db.String(200), nullable=True)

# CORREÇÃO IMPORTANTE: Função que converte o objeto Python para o formato que o JavaScript espera
def registro_to_dict(registro):
    return {
        "id": registro.id,
        "data": registro.data,
        "chegada": registro.entrada,          # Traduz 'entrada' do DB para 'chegada' no JS
        "saidaAlmoco": registro.saida_almoco, # Traduz 'saida_almoco' para 'saidaAlmoco'
        "retornoAlmoco": registro.retorno_almoco,
        "saidaFinal": registro.saida,
        "observacoes": registro.observacoes or "" # Garante que não seja nulo
    }

# Rota para obter todos os registros
@app.route('/api/registros', methods=['GET'])
def get_registros():
    registros = RegistroHora.query.order_by(RegistroHora.data.desc()).all()
    return jsonify([registro_to_dict(reg) for reg in registros])

# Rota para adicionar um novo registro
@app.route('/api/registros', methods=['POST'])
def add_registro():
    data = request.json
    
    # CORREÇÃO IMPORTANTE: Pega os dados com os nomes que o JavaScript envia
    novo_registro = RegistroHora(
        data=data.get('data'),
        entrada=data.get('chegada'),        
        saida_almoco=data.get('saidaAlmoco'),
        retorno_almoco=data.get('retornoAlmoco'),
        saida=data.get('saidaFinal'),
        observacoes=data.get('observacoes')
    )
    
    db.session.add(novo_registro)
    db.session.commit()
    return jsonify(registro_to_dict(novo_registro)), 201

# Rota para deletar um registro específico
@app.route('/api/registros/<int:registro_id>', methods=['DELETE'])
def delete_registro(registro_id):
    registro = RegistroHora.query.get(registro_id)
    if registro is None:
        return jsonify({'error': 'Registro não encontrado'}), 404
    
    db.session.delete(registro)
    db.session.commit()
    return jsonify({'message': 'Registro deletado com sucesso'}), 200

# Rota para deletar TODOS os registros
@app.route('/api/registros/all', methods=['DELETE'])
def delete_all_registros():
    try:
        num_rows_deleted = db.session.query(RegistroHora).delete()
        db.session.commit()
        return jsonify({'message': f'{num_rows_deleted} registros foram deletados.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Rota "catch-all" para servir a aplicação de página única
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/registros/batch', methods=['POST'])
def batch_add_registros():
    registros_data = request.json
    if not isinstance(registros_data, list):
        return jsonify({'error': 'O corpo da requisição deve ser uma lista de registros'}), 400

    try:
        # Apaga os registros antigos antes de carregar o backup
        db.session.query(RegistroHora).delete()

        for data in registros_data:
            novo_registro = RegistroHora(
                data=data.get('data'),
                entrada=data.get('chegada'),
                saida_almoco=data.get('saidaAlmoco'),
                retorno_almoco=data.get('retornoAlmoco'),
                saida=data.get('saidaFinal'),
                observacoes=data.get('observacoes')
            )
            db.session.add(novo_registro)
        
        db.session.commit()
        return jsonify({'message': f'{len(registros_data)} registros carregados com sucesso.'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)