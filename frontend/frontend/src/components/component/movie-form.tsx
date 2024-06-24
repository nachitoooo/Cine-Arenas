import { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function CreateMovie() {
  const [title, setTitle] = useState<string>('');
  const [releaseDate, setReleaseDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('release_date', releaseDate);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    await axios.post('http://localhost:8000/api/movies/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    setTitle('');
    setReleaseDate('');
    setDescription('');
    setImage(null);
  };

  return (
    <div className="mx-auto max-w-4xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Crear Película</h1>
        <p className="text-muted-foreground">Completa el formulario para agregar una nueva película a tu catálogo.</p>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Detalles de la Película</CardTitle>
            <CardDescription>Ingresa la información para tu nueva película.</CardDescription>
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
          <CardFooter className="flex justify-end">
            <Button type="submit">Guardar Película</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
