from deepface import DeepFace
import cv2
import time
import statistics

# Open webcam
cap = cv2.VideoCapture(0)

# List to store detected emotions and values during the specified duration
collected_results = []

# Duration for collecting data (in seconds)
collection_duration = 2.5
start_time = time.time()

# Timeout duration for resetting if no face is detected (in seconds)
no_face_timeout = 2
last_face_time = time.time()

median_text = f'Median Emotion: '

# Function to display emotion on the frame
def display_emotion(frame, text, faces):
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0,255,0), 1)  # Draw {Green} face rectangle

    cv2.putText(frame, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
    cv2.imshow('Emotion Detection', frame)

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()

    try:
        # Detect faces in the frame
        faces = cv2.CascadeClassifier('./emotion/models/haarcascade_frontalface_default.xml').detectMultiScale(
            frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) > 0:
            # Reset the timeout counter if a face is detected
            last_face_time = time.time()

            # Perform emotion detection
            result = DeepFace.analyze(frame, actions=['emotion'])

            # Check if 'emotion' is present in the result
            if 'emotion' in result[0]:
                # Get the emotion dictionary
                emotion_dict = result[0]['emotion']

                # Get the dominant emotion and its value
                dominant_emotion = max(emotion_dict, key=emotion_dict.get)
                dominant_value = emotion_dict[dominant_emotion]

                # Store the key-value pair in the list
                collected_results.append({'emotion': dominant_emotion, 'value': dominant_value})

                display_emotion(frame, median_text, faces)

            # Check if the specified duration has passed
            if time.time() - start_time > collection_duration:
                # Find the result with the highest value
                if collected_results:
                    print(collected_results)

                    # Calculate median emotion and value
                    median_emotion = statistics.median_high([result['emotion'] for result in collected_results])
                    median_value = statistics.median_high([result['value'] for result in collected_results])

                    # Display the result on the frame
                    median_text = f'Median Emotion: {median_emotion} ({median_value:.2f}%)'

                    print(f'Detected Emotion: {median_emotion}')


                    # Reset the list and start time for the next collection
                    collected_results = []
                    start_time = time.time()

        # Check if no face is detected for a specified timeout duration
        if time.time() - last_face_time > no_face_timeout:
            collected_results = []  # Reset collected results
            last_face_time = time.time()  # Reset last face time

        # Display the resulting frame
        cv2.imshow('Emotion Detection', frame)

    except ValueError:
        pass

    # Exit the loop if the 'q' key is pressed.
    if cv2.waitKey(1) == ord('q'):
        break

# Release the webcam and close all windows
cap.release()
cv2.destroyAllWindows()
