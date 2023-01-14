import React from 'react';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Dialog,
    Grid,
    IconButton,
    Typography
} from "@mui/material";
import {ItemType} from "../Item/Item";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface ItemDialogProps {
    isOpen: boolean,
    inCart: boolean,
    handleClose: () => void,
    item: ItemType,
    handleOnClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    addToFavorite: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    inFavorites: boolean
}


export const ItemDialog = ({
                               item,
                               isOpen,
                               inCart,
                               handleClose,
                               handleOnClick,
                               addToFavorite,
                               inFavorites
                           }: ItemDialogProps) => {

    return (
        <Dialog
            scroll={'body'}
            open={isOpen}
            keepMounted
            onClose={handleClose}
        >
            <Card sx={{width: 500}}>
                <CardHeader
                    avatar={
                        <Avatar src={require(`../assets/${item.image}`)}/>
                    }
                    title={<Typography variant={'h3'}
                                       fontWeight={'bold'}>{`${item.name}`}</Typography>}
                />
                <CardMedia
                    component="img"
                    sx={{maxHeight: 400}}
                    image={require(`../assets/${item.image}`)}
                    alt={item.name}
                />
                <CardContent>
                    <Grid container justifyContent={'center'}>
                        <Typography variant={'h5'}> Description: {item.description}</Typography>
                    </Grid>
                </CardContent>
                <Grid container gap={3} alignItems={'center'} justifyContent={'center'}>
                    <Grid item>
                        {inCart ?
                            <Button style={{marginLeft: 10}} variant={'contained'} color={'error'}
                                    onClick={(e) => handleOnClick(e)}>
                                Remove Item
                            </Button> :
                            <Button style={{marginLeft: 10}} variant={'contained'}
                                    onClick={(e) => handleOnClick(e)}>
                                Add Item
                            </Button>
                        }
                    </Grid>
                    <Grid item>
                        <IconButton title="הוסף למועדפים" onClick={(e) => addToFavorite(e)}>
                            <FavoriteIcon color={inFavorites ? 'error' : "inherit"}/>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            Price: {item.price} ₪
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
        </Dialog>
    )
}