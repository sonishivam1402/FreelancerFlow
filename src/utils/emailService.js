const API_URL = 'http://localhost:3001'; // Update this for production

export const sendEmail = async (templateParams) => {
  try {
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateParams)
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};