package com.example.esd_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Check for driver-email header (for Python driver simulator only)
                    String driverEmail = accessor.getFirstNativeHeader("driver-email");
                    if (driverEmail != null) {
                        Principal principal = () -> driverEmail;
                        accessor.setUser(principal);
                        System.out.println("✅ Driver connected: " + driverEmail);
                    } else {
                        System.out.println("✅ Anonymous client connected");
                    }
                    System.out.println("   Session ID: " + accessor.getSessionId());
                }

                if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                    String user = accessor.getUser() != null ? accessor.getUser().getName() : "anonymous";
                    System.out.println("📡 Subscription: " + accessor.getDestination() + " by " + user);
                }

                return message;
            }
        });
    }
}