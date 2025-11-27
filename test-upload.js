// Quick test for upload-url endpoint
fetch('http://localhost:3000/documents/upload-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'test123',
    fileName: 'test-resume.pdf',
    fileType: 'application/pdf',
    fileSize: 12345,
    documentType: 'resume'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('✅ Backend Response:')
    console.log(JSON.stringify(data, null, 2))
    if (data.success && data.data.uploadUrl) {
      console.log('\n✅ Upload URL received successfully!')
      console.log('URL:', data.data.uploadUrl)
      console.log('File Key:', data.data.fileKey)
      console.log('Expires in:', data.data.expiresIn, 'seconds')
    }
  })
  .catch(err => {
    console.error('❌ Error:', err.message)
  })
