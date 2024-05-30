'''

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

def validateCreditCard(cardNumber, expirationMonth, expirationYear, cvv):
    if len(cardNumber) != 16 or not cardNumber.isdigit():#16 digits
        return False
    currentYear = datetime.now().year
    currentMonth = datetime.now().month 
    if not (1 <= int(expirationMonth) <= 12) or int(expirationYear) < currentYear or (int(expirationYear) == currentYear and int(expirationMonth) < currentMonth):
        return False
    if len(cvv) != 3 or not cvv.isdigit():
        return False

    return True

@app.route('/api/complete-purchase', methods=['POST'])
def complete_purchase():
    data = request.json
    credit_card = data.get('creditCard')
    expiration_month = data.get('monthExpiration')
    expiration_year = data.get('yearExpiration')
    cvv = data.get('cvv')
    amount = int(data.get('amount'))
    productCharge = int(data.get('productCharge'))  
    remainingAmount = amount - productCharge
    if remainingAmount < 0:
        return jsonify(False)
    if validateCreditCard(credit_card, expiration_month, expiration_year, cvv):
        return jsonify(True)
    else:
        return jsonify(False)

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=4001)
    
 '''
