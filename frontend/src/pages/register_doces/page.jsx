import { useState } from "react"
import { TextField, Button } from "@mui/material"
import styles from './page.module.css'

import { styled } from '@mui/material/styles';
import { LuCloudUpload } from "react-icons/lu";
import Typography from '@mui/material/Typography';
import imagemDeDoces from '../../assets/images/doces_home.png';
import DocesServices from "../../services/doces"
export default function RegistrarDoces() {
    const { editar, cadastrar } = DocesServices() 
    // Cria um componente de input estilizado que ficará visualmente escondido
    const VisuallyHiddenInput = styled('input')({
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: 1,
      overflow: 'hidden',
      position: 'absolute',
      bottom: 0,
      left: 0,
      whiteSpace: 'nowrap',
      width: 1,
    });
    
    const handleSubmitForm = (e) => {
        e.preventDefault()
        console.log(FormData.nome)
        if (FormData.id == "" || FormData.id == null) {
            cadastrar(FormData)
            return
        }else{
            editar(FormData.id, FormData)
            return
        }
    }

    const [formData, setFormData] = useState(null);

    const handleFormDataChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const [fileName, setFileName] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
        setFileName(file.name);
        // Aqui você pode adicionar a lógica para fazer o upload do arquivo
        }
    };
    return (
        <>
        <h1 className={styles.tituloPagina}>Novo Produto</h1>
        <form onSubmit={handleSubmitForm}>
            <TextField name="id" sx={{display:"none"}} onChange={handleFormDataChange} />
            <div className={styles.cadastrarDoces}>
                <div className={styles.formularioCampos}>
                     <div className={styles.linhaUm}> {/*linha 1 */}
                        <TextField fullWidth
                            required
                            label="Nome"
                            type="name"
                            name="nome"
                            onChange={handleFormDataChange}
                        />
                    </div>
                    <div className={styles.linhaDois}> {/*linha 2 */}
                        <TextField fullWidth
                            required
                            label="Descrição"
                            type="description"
                            name="descricao"
                            multiline
                            rows={4}
                            onChange={handleFormDataChange}
                        />
                    </div>
                    
                    <div className={styles.linhaTres}> {/*linha 3 */}
                        <TextField fullWidth
                            required
                            name="ingredientes"
                            label="Ingredientes"
                            type="text"
                            multiline
                            rows={4}
                            onChange={handleFormDataChange}
                        />
                    </div>
                    
                    <div className={styles.linhaQuatro}> {/*linha 4 */}
                        <TextField fullWidth
                            required 
                            name="tipo_de_medida"
                            label="Tipo de Medida"
                            type="text"
                            onChange={handleFormDataChange}
                        />
                        <TextField fullWidth
                            required
                            name="preco"
                            label="Preço"
                            type="text"
                            onChange={handleFormDataChange}
                        />
                    </div>
                </div>

                <div className={styles.linhaUpload}>
                    <img src={imagemDeDoces} className={styles.imagemUpload}/>
                    <Button
                        component="label" // Importante: faz o botão se comportar como uma <label>
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<LuCloudUpload />}
                        style={{backgroundColor:"#094848"}}
                    >
                        Enviar imagem
                        <VisuallyHiddenInput type="file" accept="image/*" name="imagem"  onChange={handleFileChange} />
                    </Button>
                    {fileName && <Typography variant="body1">{fileName}</Typography>}
                </div>
            </div>
            <div className={styles.divBtn}>
                <Button type="submit" class="botao" style={{width:"20%"}}>Cadastrar</Button>
            </div>
        </form>
        </>
    );
}
