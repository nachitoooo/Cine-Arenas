import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import '../../app/movie-form.css'; // Importación correcta del archivo CSS

interface MovieFormProps {
  movieId?: string;
  initialData?: Movie;
  onCancel?: () => void;
  onSave?: (movie: Movie) => void;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  image: string | null;
}

const MovieForm = ({ movieId, initialData, onCancel, onSave }: MovieFormProps) => {
  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [releaseDate, setReleaseDate] = useState<string>(initialData?.release_date || '');
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (movieId && !initialData) {
      axios.get(`http://localhost:8000/api/movies/${movieId}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      }).then((response) => {
        const { title, release_date, description, image } = response.data;
        setTitle(title);
        setReleaseDate(release_date);
        setDescription(description);
        setImage(null);
      }).catch((error) => {
        console.error('Error fetching movie:', error);
      });
    }
  }, [movieId, initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('release_date', releaseDate);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    const token = localStorage.getItem('authToken');

    try {
      let response;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        },
      };

      if (movieId) {
        response = await axios.put(`http://localhost:8000/api/movies/${movieId}/`, formData, config);
      } else {
        response = await axios.post('http://localhost:8000/api/movies/', formData, config);
      }

      if (onSave) {
        onSave(response.data);
      }

      router.push('/edit-movie');
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{movieId ? 'Editar Película' : 'Crear Película'}</h3>
          <p className="card-description">Completa el formulario para {movieId ? 'editar' : 'agregar'} una película a tu catálogo.</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <Label htmlFor="title" className="form-label">Título</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" placeholder="Ingresa el título de la película" />
            </div>
            <div className="form-group">
              <Label htmlFor="releaseDate" className="form-label">Fecha de Estreno</Label>
              <Input id="releaseDate" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} className="form-input" placeholder="Selecciona la fecha de estreno" />
            </div>
            <div className="form-group">
              <Label htmlFor="description" className="form-label">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                placeholder="Proporciona una breve descripción de la película"
                style={{ minHeight: '120px' }}
              />
            </div>
            <div className="form-group">
              <Label htmlFor="image" className="form-label">Imagen</Label>
              <Input 
                id="image" 
                type="file" 
                onChange={(e) => {
                  if (e.target.files) {
                    setImage(e.target.files[0]);
                  }
                }} 
                className="form-input"
              />
            </div>
            <div className="form-footer">
              {onCancel && (
                <Button type="button" onClick={onCancel} className="form-button">
                  Cancelar
                </Button>
              )}
              <Button type="submit" className="form-button">{movieId ? 'Guardar Cambios' : 'Guardar Película'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MovieForm;
