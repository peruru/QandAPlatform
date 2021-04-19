package com.qap.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Comments.
 */
@Entity
@Table(name = "comments")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Comments implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "text")
    private String text;

    @ManyToOne
    @JsonIgnoreProperties(value = { "questions", "questionLikes", "answerLikes" }, allowSetters = true)
    private Users users;

    @ManyToOne
    @JsonIgnoreProperties(value = { "answerLikes", "questions" }, allowSetters = true)
    private Answers answers;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Comments id(Long id) {
        this.id = id;
        return this;
    }

    public String getText() {
        return this.text;
    }

    public Comments text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Users getUsers() {
        return this.users;
    }

    public Comments users(Users users) {
        this.setUsers(users);
        return this;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Answers getAnswers() {
        return this.answers;
    }

    public Comments answers(Answers answers) {
        this.setAnswers(answers);
        return this;
    }

    public void setAnswers(Answers answers) {
        this.answers = answers;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Comments)) {
            return false;
        }
        return id != null && id.equals(((Comments) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Comments{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            "}";
    }
}
