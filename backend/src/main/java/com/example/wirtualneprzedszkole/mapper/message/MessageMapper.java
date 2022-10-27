package com.example.wirtualneprzedszkole.mapper.message;


import com.example.wirtualneprzedszkole.model.dao.User;
import com.example.wirtualneprzedszkole.model.dao.message.Message;
import com.example.wirtualneprzedszkole.model.dao.message.UserMessage;
import com.example.wirtualneprzedszkole.model.dto.message.MessageDto;
import com.example.wirtualneprzedszkole.model.dto.message.SendMessageDto;
import com.example.wirtualneprzedszkole.model.dto.message.UserMsgDto;

import java.util.List;
import java.util.stream.Collectors;

public class MessageMapper {
    private MessageMapper(){}


    public static List<UserMsgDto> usersMapToUsersMsgDto(List<UserMessage> users) {
        return users.stream()
                .map(MessageMapper::userMapToUserMsgDto)
                .collect(Collectors.toList());
    }

    public static UserMsgDto userMapToUserMsgDto(UserMessage user) {
        return UserMsgDto.builder()
                .email(user.getUser().getEmail())
                .build();
    }

    public static UserMsgDto userMapToUserMsgDto(User user) {
        return UserMsgDto.builder()
                .email(user.getEmail())
                .build();
    }

    public static List<String> mapToMessageDto(List<UserMsgDto> usersMsgDto) {
        return usersMsgDto.stream()
                .map(UserMsgDto::getEmail)
                .collect(Collectors.toList());
    }

    public static Message mapToDao(SendMessageDto msgDto, List<User> users) {
        return Message.builder()
                .id(msgDto.getId())
                .author(msgDto.getAuthor())
                .content(msgDto.getContent())
                //.isRead(msgDto.isRead())
                .subject(msgDto.getSubject())
                //.to(users)
                //.userMessageList(msgDto.getUserMessageList())
                .build();
    }

    public static Message mapSendMessageDtoToMessage(SendMessageDto sendMessageDto) {
        return Message.builder()
                .id(sendMessageDto.getId())
                .author(sendMessageDto.getAuthor())
                .content(sendMessageDto.getContent())
                //.isRead(sendMessageDto.isRead())
                .subject(sendMessageDto.getSubject())
                //.userMessageList(sendMessageDto.getUserMessageList())
                .build();
    }

    public static List<MessageDto> mapMessagesToDto(List<Message> messages) {
        return messages.stream()
                .map(MessageMapper::mapToDto)
                .collect(Collectors.toList());
    }

    public static MessageDto mapToDto(Message message) {
        return MessageDto.builder()
                .id(message.getId())
                .to(mapToMessageDto(usersMapToUsersMsgDto(message.getUserMessageList())))
                .content(message.getContent())
                .author(userMapToUserMsgDto(message.getAuthor()).getEmail())
                //.isRead(message.isRead())
                .subject(message.getSubject())
                //.userMessageList(message.getUserMessageList())
                .build();
    }

    public static MessageDto mapToDtoWithIsRead(Message message) {
        return MessageDto.builder()
                .id(message.getId())
                .to(mapToMessageDto(usersMapToUsersMsgDto(message.getUserMessageList())))
                .content(message.getContent())
                .author(userMapToUserMsgDto(message.getAuthor()).getEmail())
                //.isRead(getIsReadFromUserMessage(message.getUserMessageList(), message.getId()))
                .subject(message.getSubject())
                //.userMessageList(message.getUserMessageList())
                .build();
    }

}
