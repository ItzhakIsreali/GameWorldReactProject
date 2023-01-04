import {PubSub} from "graphql-subscriptions";
import {Server} from "http";
import {Express} from "express";
import {ApolloServer} from "apollo-server-express";
import {typeDefs} from "./schema/schema";
import {resolvers} from "./resolvers/resolver";
import {createUserCart, releaseUserCart} from "./cart";

export const pubsub = new PubSub();

export const getCookie = (cookieName: string, cookie: string | undefined) => {
    let final = undefined;

    if (cookie) {
        let temp = cookie!.split(";");
        final = temp.filter((item) => item.includes(cookieName))[0].split("=")[1];
    }
    return final;
}

export const startApolloServer = async (httpServer: Server, app: Express): Promise<ApolloServer> => {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({res, req, connection}) => {
            if (connection) {
                return connection.context
            }

            if (getCookie("id_token", req.headers.cookie)) {
                let temp = getCookie("id_token", req.headers.cookie);
                return {userId: temp};
            } else {
                res.cookie("id_token", Date.now().toString());
                console.log(getCookie("id_token", req.headers.cookie))
                return {userId: Date.now().toString()}
            }
        },
        subscriptions: {
            onConnect: (connectionParams, webSocket, context) => {
                console.log(context)
                if (getIdTokenFromRawHeaders('id_token', context.request.rawHeaders)) {
                    const userId = getIdTokenFromRawHeaders("id_token", context.request.rawHeaders);
                    createUserCart(userId);
                    return {userId};
                }
                throw new Error(" user without id_token tries to open connection");
            },
            onDisconnect: (websocket, context) => {
                context.initPromise?.then(value => {
                    const cartUpdate = releaseUserCart(value.userId);
                    pubsub.publish("CART_UPDATE", {cartUpdate});
                }).catch(error => console.log(`Error in Promise ${error}`))
            },
        },
        playground: {
            subscriptionEndpoint: `/graphql`,
            settings: {
                "request.credentials": "include",
            }
        }

    });
    await apolloServer.start();
    apolloServer.applyMiddleware({app});
    apolloServer.installSubscriptionHandlers(httpServer);
    return apolloServer;

}

const getIdTokenFromRawHeaders = (idToken: string, rawHeaders: string[]): any => {
    let temp;
    temp = rawHeaders.filter((item) => item.includes(idToken))

    return getCookie(idToken, temp[0]);
}
