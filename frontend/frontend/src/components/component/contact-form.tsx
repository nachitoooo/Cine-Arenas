import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  { id: 1, name: "María González", text: "¡Excelente experiencia cinematográfica! El sonido y la imagen son impresionantes.", rating: 5 },
  { id: 2, name: "Juan Pérez", text: "Las butacas son muy cómodas y el servicio es de primera clase.", rating: 4 },
  { id: 3, name: "Ana Rodríguez", text: "Me encanta la selección de películas. Siempre hay algo interesante para ver.", rating: 5 },
  { id: 4, name: "Carlos Sánchez", text: "El ambiente es genial. Definitivamente mi cine favorito en la ciudad.", rating: 4 },
]

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
        />
      ))}
    </div>
  )
}

export default function ContactFormWithCarousel() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formState)
    setFormState({ name: '', email: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 10000) // Cambié a 10 segundos
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      {/* Opiniones */}
      <div className="w-full max-w-6xl bg-[#0c0c0c] rounded-lg shadow-2xl overflow-hidden mb-8">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Opiniones de nuestros clientes</h3>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0">
                    <blockquote className="text-white">
                      <StarRating rating={testimonial.rating} />
                      <p className="text-lg mt-2">&ldquo;{testimonial.text}&rdquo;</p>
                      <footer className="mt-2 text-sm text-gray-400">{testimonial.name}</footer>
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={prevTestimonial} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
              <ChevronLeft className="w-6 h-6" />
              <span className="sr-only">Testimonio anterior</span>
            </button>
            <button onClick={nextTestimonial} className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
              <ChevronRight className="w-6 h-6" />
              <span className="sr-only">Siguiente testimonio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario de contacto */}
      <div className="w-full max-w-6xl bg-[#0c0c0c] rounded-lg shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-4 flex items-center justify-center bg-[#161616]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3198.9686691177!2d-56.67999972416621!3d-36.69929077227602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959c6f16ee2b2f2d%3A0x8be2b50da789f06!2sCine%20Arenas%203D!5e0!3m2!1ses-419!2sar!4v1725637983311!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Cinema Location Map"
            />
          </div>
          <div className="w-full lg:w-1/2 p-8 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white">Contáctanos</h2>
              <p className="mt-2 text-sm text-gray-400">Queremos saber tus opiniones!</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="sr-only">Nombre</label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nombre"
                  value={formState.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Email"
                  value={formState.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Mensaje</label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  className="w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tu mensaje"
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                >
                  Enviar Mensaje
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
