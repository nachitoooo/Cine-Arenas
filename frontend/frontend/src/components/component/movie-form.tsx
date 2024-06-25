import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
    if (movieId && !initialData) {
      axios.get(`http://localhost:8000/api/movies/${movieId}/`).then((response) => {
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

    try {
      let response;
      if (movieId) {
        response = await axios.put(`http://localhost:8000/api/movies/${movieId}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post('http://localhost:8000/api/movies/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
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
    <div className="mx-auto max-w-4xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">{movieId ? 'Editar Película' : 'Crear Película'}</h1>
        <p className="text-muted-foreground">Completa el formulario para {movieId ? 'editar' : 'agregar'} una película a tu catálogo.</p>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Detalles de la Película</CardTitle>
            <CardDescription>Ingresa la información para tu película.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ingresa el título de la película" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="releaseDate">Fecha de Estreno</Label>
                <Input id="releaseDate" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} placeholder="Selecciona la fecha de estreno" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Proporciona una breve descripción de la película"
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Imagen</Label>
              <Input 
                id="image" 
                type="file" 
                onChange={(e) => {
                  if (e.target.files) {
                    setImage(e.target.files[0]);
                  }
                }} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {onCancel && (
              <Button type="button" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit">{movieId ? 'Guardar Cambios' : 'Guardar Película'}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default MovieForm;
