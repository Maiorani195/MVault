package com.mvault.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        LocalDateTime timestamp,
        Integer status,
        String erro,
        String mensagem,
        String path,
        Map<String , String> validacoes
) {

    public ErrorResponse (Integer status , String erro , String mensagem, String path){
        this(LocalDateTime.now(),status,erro,mensagem,path,null);

    }

    public ErrorResponse(Integer status , String erro , String mensagem , String path , Map<String , String> validacoes){
        this(LocalDateTime.now(), status,erro,mensagem,path,validacoes);
    }

}
