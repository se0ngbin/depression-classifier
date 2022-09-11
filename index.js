function onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const value = Object.fromEntries(data.entries());

    const predictionEl = document.getElementById('prediction')
    const confidencesEl = document.getElementById('confidences')
    const errorEl = document.getElementById('error')
    const predTitleEl = document.getElementById('predTitle')


    // if value.text is empty, return error
    if (value.text === '') {
        predTitleEl.innerHTML = 'Please enter a text to classify!'
        return;
    }

    fetch('https://hf.space/embed/se0ngbin/depression-classifier/+/api/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "data": [value.text] })
    })
        .then(function (response) {
            if (response.status != 200) {
                errorEl.innerHTML = '<u>Sorry the API is not working currently. Please try again later</u>'
                predictionEl.innerHTML = '';
                confidencesEl.innerHTML = '';
                return;
            }
            return response.json();
        }).then(function (json_response) {
            console.log(json_response)
            const label = json_response?.data[0]?.label;
            const pred = label ? 'Depression' : 'Not Depression';
            const confidence = json_response?.data[0]?.confidences[0]?.confidence

            // show the prediction
            predTitleEl.innerHTML = 'Results:'
            predictionEl.innerHTML = `Prediction: ${pred}`;
            confidencesEl.innerHTML = `Confidence: ${confidence}`
            errorEl.innerHTML = '';
            return;
        })


    // while api is loading
    predTitleEl.innerHTML = 'Loading...'
    predictionEl.innerHTML = '';
    confidencesEl.innerHTML = '';
    errorEl.innerHTML = '';

    console.log(predictionEl, confidencesEl, errorEl);
}

