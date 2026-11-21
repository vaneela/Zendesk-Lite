package com.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Note {

    private Integer authorId;

    private String note;

    private LocalDateTime time;
}