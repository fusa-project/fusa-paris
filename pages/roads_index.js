import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVideo } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono de audio

const RoadsHome = () => {   
    const [roadsType, setRoadsType] = useState(null);
    return (
      <div className="container">
          <Head>
              <title>FuSA Roads</title>
          </Head>

          <main>
              <h1 className="title">
              FuSA Roads
              </h1>

              <p className="description">
              Análisis vehicular para audio y video
              </p>
              <div className="grid">
                <Link href={{ pathname: '/roads', query: { type: 'audio' } }}>
                    <a className="card" onClick={() => setRoadsType('audio')}>
                    <h3>Subir audio</h3>
                    <FontAwesomeIcon icon={faVolumeUp} /> {/* Icono de audio */}
                    </a>
                </Link>
                {
                <Link href={{ pathname: '/roads', query: { type: 'video' } }}>
                    <a className="card" onClick={() => setRoadsType('video')}>
                    <h3>Subir video</h3>
                    <FontAwesomeIcon icon={faVideo} /> {/* Icono de audio */}
                    </a>
                </Link>
                }
              </div>
          </main>

          <footer>
              Universidad Austral de Chile
          </footer>
      </div>
    )
}

export default RoadsHome;