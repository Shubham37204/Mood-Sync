from flask import Flask, render_template, request, session, jsonify
from flask_cors import CORS
from random import randint
from csv import writer, QUOTE_MINIMAL
from os import getcwd
import mysql.connector as db
from smtplib import SMTP
from email.message import EmailMessage
from string import Template
from pathlib import Path  # like os.path
from config import *
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from subprocess import run, PIPE
from threading import Thread

# PS 02 : Develop an AI-driven solution to curate personalized entertainment experiences, 
# dynamically recommending movies, music, and events based on individual tastes, habits, and mood.

app = Flask(__name__)

print('current dir:', getcwd())

mydb = db.connect(
    host = mysql_host,
    user = mysql_user,
    password=mysql_password,
    database=database_name,
)
cursor = mydb.cursor()

CORS(app, supports_credentials=True, allow_headers=["Content-Type", "Authorization"])
print(__name__)

print()

# Generate a secure and random secret key
app.secret_key = secret_key
app.config['SECRET_KEY'] = secret_key
app.config['JWT_SECRET_KEY'] = secret_key

# Set JWT expiration time to 5 minutes
app.config['JWT_EXPIRATION_DELTA'] = timedelta(minutes=30)

jwt = JWTManager(app)

# app.run(host='192.168.29.179', port=5000, debug=True)

# Home Page
@app.route('/')
def my_home():
    return render_template('index.html')


'''-----------------------------------------------------------------------------------------------------'''

# making it dynamic.
@app.route('/<string:page_name>')
def html_page(page_name):
    return render_template(page_name)


'''-----------------------------------------------------------------------------------------------------'''

# Disabling Favicon Request (chatgpt)
@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')


'''-----------------------------------------------------------------------------------------------------'''

# (EMAIL CREATION) -> "OTP verification, Confimation of Contact Purpose, Confirmation for Subscibing to Newletter".
def send_email(team, subject, receiver, email_template, email_values):
    try:
        html = Template(Path(f'{email_template}.html').read_text())
        email = EmailMessage()

        email['from'] = team  # name.
        email['to'] = receiver  # To = Receiver.
        email['subject'] = subject  # Subject of Email.
        print(email_values)

        # The message is in html format with tags.
        # Using **args is same as using (name = 'xyz', otp = '000000').
        email.set_content(html.substitute(**email_values), 'html')

        # print(email)

        # Sending the Email.
        with SMTP(host='smtp.gmail.com', port=587) as smtp:
            smtp.ehlo()  # starting the server.

            smtp.starttls()  # Encryption mechanism.
            # login in using 'email-id' and 'app-password'.
            smtp.login(my_email, email_app_password)

            smtp.send_message(email)
            print('\nAll good Boss !')

    except Exception as e:
        print(f"Error while Sending the Email: {str(e)}")
        return jsonify({'error': 'An Error occurred on the server, while trying to Send the Email.'})


'''-----------------------------------------------------------------------------------------------------'''

# (WRITING INTO CSV) -> "email.csv, contact.csv" file.
def write_to_csv(file_path, data):
    print('current dir:', getcwd())
    try:
        with open(file_path, mode='a', newline='') as database:
            csv_writer = writer(database, delimiter=',', quotechar='"', quoting=QUOTE_MINIMAL)
            csv_writer.writerow(data)

    except Exception as e:
        print(f"Error while saving to database: {str(e)}")
        return jsonify({'error': 'An Error occurred on the server, while trying to Handle Your Query.'})


'''-----------------------------------------------------------------------------------------------------'''

# OTP "generate, send ,resend & verify".

# Generating the Random 6 digit Otp.
def gen_otp():
    return randint(100000, 999999)


# Sending the OTP for 1st time or for resend.
def send_otp():
    session['otp_num'] = gen_otp()
    print(session.get('otp_num'), '\n')
    send_email('Face_Rec_Dec Team', 'Your Email Verification OTP (One-Time-Password).', session.get('login_id'), './emails/email_otp', {'name': session.get('name'), 'otp': session.get('otp_num')})


# Route for resending OTP.
@app.route('/resend', methods=['POST', 'GET'])
def resend():
    try:
        send_otp()
        return jsonify({'access': 'Granted'})
    
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error occurred during OTP Resending.'})


# OTP verification.
@app.route('/verify_otp', methods=['POST', 'GET'])
def verify_otp():
    if request.method == 'POST':
        try:
            print(session)
            print(type(session.get('otp_num')))  # We get the Values in str and not in Int, thats why it was malfunctioning.
            OTP = int(request.form.get('otp'))
            print(type(OTP))
            if OTP == session.get('otp_num'):

                # Insert the new user into the database
                insert_query = "INSERT INTO login (login_id, name, password) VALUES (%s, %s, %s)"
                cursor.execute(insert_query, (session.get('login_id'), session.get('name'), session.get('password')))
                mydb.commit()

                return jsonify({'access': 'Granted', 'name': session.get('name'), 'message': f"{session.get('name')} OTP verification successful."})

            return jsonify({'access': 'Denied', 'message': 'The Entered OTP is Wrong, Please try again.'})

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'Error occurred during OTP verification.'})

    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'})


'''-----------------------------------------------------------------------------------------------------'''

# Checking the Password from the database (REGISTER).
@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        try:
            name = request.form.get('name')
            login_id = request.form.get('login_id')
            password = request.form.get('password')

            # session.clear() #To clear all values from the Session. {Here Manually}
            session.pop('name', None)
            session.pop('login_id', None)
            session.pop('password', None)

            # print(name,login_id,password)

            # Check if the user already exists.
            query = "SELECT * FROM login WHERE login_id = %s"
            cursor.execute(query, (login_id,))

            data = cursor.fetchone()

            if data:    # User already exists
                return jsonify({'access': 'Denied', 'message': 'User already exists. Please Use a different Email.'}), 200

            session['name'] = name
            session['login_id'] = login_id
            session['password'] = password
            print(session)

            send_otp()  #Generate, Send the Otp to Email.

            return jsonify({'access': 'Granted', 'email': session.get('login_id')}), 200

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An Error occurred on the server, while creating Account.'}), 500

    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404


'''-----------------------------------------------------------------------------------------------------'''

# Checking the Password from the database.
@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        try:
            login_id = request.form.get('login_id')
            password = request.form.get('password')

            # Use parameterized query to prevent SQL injection
            query = "SELECT * FROM login WHERE login_id = %s AND password = %s"
            cursor.execute(query, (login_id, password))

            data = cursor.fetchone()
            print(data)
            if data:    # Successful login
                access_token = create_access_token(identity=login_id)
                print(access_token)
                return jsonify({'access': 'Granted', 'access_token': access_token})

            # Invalid login credentials
            return jsonify({'access': 'Denied', 'message': 'Invalid login credentials.'})

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An Error occurred on the server, while performing Logging.'})

    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'})


'''-----------------------------------------------------------------------------------------------------'''

# Logging Out the Users.
@app.route('/logout', methods=['POST', 'GET'])
@jwt_required()  # Require a valid JWT token for logout
def logout():
    try:
        current_user = get_jwt_identity()
        print(f'Logging out user: {current_user}')
        return jsonify({'access': 'Granted'})   # You can add additional logic here, such as logging or token revocation if needed.

    except Exception as e:
        print(str(e))
        return jsonify({'error': 'An Error occurred on the server, while performing LogOut.'})


'''-----------------------------------------------------------------------------------------------------'''    

# writing into the information of the "contact page" into 'database.csv' file.
def contact_csv(data):
    file_path = './database/csv/contact.csv'
    write_to_csv(file_path, [data['fname'], data['lname'], data['email'], data['message']])


# To send the email to the user's Gmail for "Confimation of Contact Purpose".
def email_contact(data):
    team = 'Face_Rec_Dec Support-Team'
    subject = 'Support Confirmation for the Query.'
    template_name = './emails/email_contact'
    email_values = {'name': data['fname'] + ' ' + data['lname']}

    send_email(team, subject, data['email'], template_name, email_values)


# Accepting the Contact Form, inserting data to 'contact.csv' and Sending a Email to User.
@app.route('/contact', methods=['POST', 'GET'])
def contact():
    if request.method == 'POST':
        try:
            data = request.form.to_dict()
            if data:
                print(f"Received data: {data}")

                email_contact(data)
                contact_csv(data)

                return jsonify({'access': 'Granted', 'message' : f"Thank You {data['fname'] + ' ' + data['lname']} for Contacting Us, We will reach out to you Soon."})

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An Error occurred on the server, while submitting Information.'})
    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'})


'''-----------------------------------------------------------------------------------------------------'''

# To send the email to the user's Gmail for "Forgot Password Purpose".
def email_forgot(email_id, data):
    team = 'Face_Rec_Dec Support-Team'
    subject = 'Forgotten Password'
    template_name = './emails/email_forgot'
    email_values = {'name': data[0], 'password': data[1]}

    send_email(team, subject, email_id, template_name, email_values)


# Sending the Admin's Password to the Email, If the Admin Forgets his Password.
@app.route('/forgot', methods=['POST', 'GET'])
def forgot():
    if request.method == 'POST':
        try:
            email_id = request.form.get('email')
            print(f"Received data: {email_id}")

            # Check if the user exists or not.
            query = "SELECT name, password FROM login WHERE login_id = %s"
            cursor.execute(query, (email_id,))

            data = cursor.fetchone()
            print(data)

            if data:    #if user Exists.
                email_forgot(email_id, data)
                return jsonify({'access': 'Granted', 'message' : f'Your Password has been Sent to {email_id}'})

            return jsonify({'access': 'Denied', 'message': 'Invalid login credentials.'})

        except Exception as e:
            print(str(e))
            return jsonify({'error': 'An Error occurred on the server, while Trying to help you.'})

    else:
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'})


'''-----------------------------------------------------------------------------------------------------'''

# delte from user_info table.
@app.route('/delete_account', methods=['POST', 'GET'])
def delete_account():
    if request.method == 'POST':
        try:
            login_id = request.form.get('user_id')

            # Use parameterized query to prevent SQL injection
            query = "SELECT * FROM login WHERE login_id = %s"
            print("SQL Query:", query)  # Logging the SQL query
            cursor.execute(query, (login_id,))

            data = cursor.fetchone()
            print(data)
            if data:
        
                # Use parameterized query to prevent SQL injection
                query = "DELETE FROM login WHERE login_id = %s"
                print("SQL Query:", query)  # Logging the SQL query
                cursor.execute(query, (login_id,))
                mydb.commit()

                return jsonify({'success': True, 'message': f'Deleted Account & Folder for user with ID: {login_id}'}), 200

            else:
                return jsonify({'success': False, 'message': 'User Account does not exist.'}), 200

        except Exception as e:
            mydb.rollback()
            print(str(e))
            return jsonify({'error': 'An error occurred on the server.'}), 500
    else:
        # Display the login form
        return jsonify({'error': 'POST is Either Broken or Not Working, Please Wait, While we fix the Issue.'}), 404

    
'''-----------------------------------------------------------------------------------------------------'''

# Function to run the emotion detection script and return the result
def run_emotion_detection():
    try:
        result = run(['python', './emotion/emotion_detection_script.py'], stdout=PIPE, text=True)
        return result.stdout.strip()
    
    except Exception as e:
        print(f"Error running emotion detection: {e}")
        return ""


# Function to run the speech script
def run_voice(media_type, sentence):
    custom_sentence = f'The {media_type} Representing your Mood: {sentence}'
    try:
        run(['python', './speaking/voice_script.py', custom_sentence], stdout=PIPE, text=True)
    except Exception as e:
        print(e)
        pass


# Function to select media from the database
def select_media(current_login_id, media_type, emotion):
    try:
        # Execute SQL query to select media based on type and emotion
        query = 'SELECT * FROM media_links WHERE media_type = %s AND emotion = %s ORDER BY RAND() LIMIT 1;'
        cursor.execute(query, (media_type, emotion))
        media_data = cursor.fetchone()

        print(media_data)

        if media_data:
            # Record media history
            query = "INSERT INTO media_history (login_id, media_id, media_type, emotion) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (current_login_id, media_data[0], media_type, emotion))
            mydb.commit()


            # Call the function to play the media voice in a Thread
            try:
                Thread(target=run_voice, args=(media_type, media_data[1],)).start()
            except ValueError:
                pass

            return {'id': media_data[0], 'name': media_data[1], 'link': media_data[2], 'type': media_data[3]}
        
        else:
            return {'error': 'No media found for the given emotion'}

    except Exception as e:
        mydb.rollback()
        print(e)
        return {'error': str(e)}


# Route for detecting emotion and selecting media
@app.route('/detect_emotion')
@jwt_required()  # Require a valid JWT token to select media
def detect_and_select_media():
    try:
        # Get the user's identity from the JWT token
        current_login_id = get_jwt_identity()

        # Run emotion detection
        emotion_result = run_emotion_detection()

        # Extract emotion from the result
        detected_emotion = emotion_result.split(":")[-1].strip()

        # Get media type and emotion from the request
        media_type = request.args.get('type')
        emotion = detected_emotion

        # Select media from the database
        media_data = select_media(current_login_id, media_type, emotion)

        if media_data.get('error'):
            return jsonify({'error': media_data['error']})

        # Return the selected media data
        return jsonify(media_data)

    except Exception as e:
        print(str(e))
        return jsonify({'error': 'An error occurred while selecting media.'})

                                   
'''-----------------------------------------------------------------------------------------------------'''

@app.route('/media_history')
@jwt_required()  # Require a valid JWT token to access media history
def media_history():
    try:
        # Get the user's identity from the JWT token
        current_login_id = get_jwt_identity()
        
        # Fetch recent media history for the user from the database
        query = "SELECT * FROM media_history WHERE login_id = %s ORDER BY timestamp DESC LIMIT 10;"
        cursor.execute(query, (current_login_id,))
        results = cursor.fetchall()

        # Format the results
        media_history = []
        for row in results:
            history_entry = {'id': row[0], 'login_id': row[1], 'media_id': row[2], 'media_type': row[3], 'timestamp': row[4].strftime("%Y-%m-%d %H:%M:%S")}  # Format timestamp as string
            media_history.append(history_entry)

        return jsonify({'media_history': media_history})

    except db.Error as err:
        print(f"Error: {err}")
        return jsonify({'error': 'An error occurred while fetching media history.'}), 500

