import React, { useEffect } from 'react'

export default function useRazorPay() {
    useEffect(() => {
        console.log("razor pay script appended")
        const script = document.createElement('script')
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.removeChild(script)
        }
    }, [])
}
